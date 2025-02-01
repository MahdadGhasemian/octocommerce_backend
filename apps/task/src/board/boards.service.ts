import { Inject, Injectable } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import {
  BOARD_FULL_PAGINATION_CONFIG,
  BOARD_PAGINATION_CONFIG,
} from './pagination-config';
import { Board, Comment, Content, Group, Project, User } from '@app/task';
import { FindOptionsWhere } from 'typeorm';
import { UpdateSequenceBoardDto } from './dto/update-sequence-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  BoardCreatedEvent,
  BoardUpdatedEvent,
  CommentType,
  ContentType,
  EVENT_NAME_BOARD_CREATED,
  EVENT_NAME_BOARD_UPDATED,
  NOTIFICATION_SERVICE,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BoardsService {
  constructor(
    private readonly boardsRepository: BoardsRepository,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User) {
    let board = new Board({
      ...createBoardDto,
      created_by: new User({ id: user.id }),
      flow_users: [new User({ id: user.id })],
      assigned_to: createBoardDto?.assigned_to_user_id
        ? new User({ id: createBoardDto.assigned_to_user_id })
        : undefined,
      project: new Project({ id: createBoardDto.project_id }),
      group: createBoardDto?.group_id
        ? new Group({ id: createBoardDto.group_id })
        : undefined,
    });

    const result = await this.boardsRepository.create(board);

    board = await this.findOne({ id: result.id });

    this.notficationClient.emit(
      EVENT_NAME_BOARD_CREATED,
      new BoardCreatedEvent(board),
    );

    return board;
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.boardsRepository.entityRepository,
      BOARD_PAGINATION_CONFIG,
    );
  }

  async findAllWithFullRelations(query: PaginateQuery) {
    return paginate(
      query,
      this.boardsRepository.entityRepository,
      BOARD_FULL_PAGINATION_CONFIG,
    );
  }

  async findOne(boardDto: GetBoardDto) {
    return this.boardsRepository.findOne(boardDto, {
      project: {
        users: true,
      },
      group: true,
      comments: {
        content: {
          user: true,
        },
        created_by: true,
      },
      created_by: true,
      assigned_to: true,
      flow_users: true,
    });
  }

  async read(boardDto: GetBoardDto) {
    return this.boardsRepository.findOne(boardDto);
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, user: User) {
    const where = [
      { id, assigned_to_user_id: user.id },
      { id, created_by_user_id: user.id },
    ];

    let board = await this.boardsRepository.findOne(
      where as FindOptionsWhere<Board>,
      {
        flow_users: true,
        comments: {
          content: true,
        },
      },
    );

    let groupUpdated = false;
    let userAssignUpdated = false;
    let generanData = false;

    // Update main properties
    board.priority = updateBoardDto.priority ?? board.priority;
    board.title = updateBoardDto.title ?? board.title;
    board.description = updateBoardDto.description ?? board.description;
    board.board_sequence_number =
      updateBoardDto.board_sequence_number ?? board.board_sequence_number;
    if (updateBoardDto.title || updateBoardDto.description) {
      generanData = true;
    }

    // Update flow_users
    if (updateBoardDto.assigned_to_user_id) {
      userAssignUpdated = true;
      board.assigned_to = new User({
        id: updateBoardDto.assigned_to_user_id,
      });
      board.flow_users = [
        ...board.flow_users,
        new User({ id: updateBoardDto.assigned_to_user_id }),
      ];
    }

    // Update Project
    if (updateBoardDto.project_id) {
      board.project = new Project({ id: updateBoardDto.project_id });
    }

    // Update Group
    if (updateBoardDto.group_id) {
      groupUpdated = true;
      board.group = new Group({ id: updateBoardDto.group_id });
    }

    // Update Comment
    const contentItems = this.generateContents(
      updateBoardDto,
      groupUpdated,
      userAssignUpdated,
      generanData,
    );
    if (contentItems?.length) {
      board.comments = [
        ...board.comments,
        ...contentItems.map(
          (content) =>
            new Comment({
              comment_type: CommentType.ACTIVITY,
              content: new Content({
                ...content,
              }),
              created_by: new User({ id: user.id }),
            }),
        ),
      ];
    }

    // Save the updated Board entity
    const result = await this.boardsRepository.save(board);

    board = await this.findOne({ id: result.id });

    this.notficationClient.emit(
      EVENT_NAME_BOARD_UPDATED,
      new BoardUpdatedEvent(board),
    );

    return board;
  }

  async remove(id: number) {
    return this.boardsRepository.findOneAndDelete({ id });
  }

  async sequenceNumbersUpdate(updateSequenceBoardDto: UpdateSequenceBoardDto) {
    const { data } = updateSequenceBoardDto;

    data?.map(async (updateData) => {
      const board = await this.boardsRepository.findOne({
        id: updateData.board_id,
      });

      // Update Sequence Number
      board.board_sequence_number =
        updateData.board_sequence_number ?? board.board_sequence_number;

      // Update Group
      if (updateData.group_id) {
        board.group = new Group({ id: updateData.group_id });
      }

      // Save the updated Board entity
      await this.boardsRepository.save(board);
    });

    return {};
  }

  async addCommentUserComment(
    id: number,
    createCommentDto: CreateCommentDto,
    user: User,
  ) {
    const where = [
      { id, assigned_to_user_id: user.id },
      { id, created_by_user_id: user.id },
    ];

    const board = await this.boardsRepository.findOne(
      where as FindOptionsWhere<Board>,
      {
        comments: true,
      },
    );

    // Update Comments
    board.comments = [
      ...board.comments,
      new Comment({
        comment_type: CommentType.ACTIVITY,
        content: new Content({
          content_type: ContentType.USER_COMMENT,
          content: createCommentDto.content,
          content_follow: createCommentDto.content_follow,
        }),
        created_by: new User({ id: user.id }),
      }),
    ];

    // Save the updated Board entity
    const result = await this.boardsRepository.save(board);

    return this.findOne({ id: result.id });
  }

  generateContents(
    updateBoardDto: UpdateBoardDto,
    groupUpdated: boolean,
    userAssignUpdated: boolean,
    generanData: boolean,
  ) {
    const items = [];
    if (groupUpdated) {
      items.push({
        content_type: ContentType.NEW_GROUP,
        group: new Group({ id: updateBoardDto.group_id }),
      });
    }
    if (userAssignUpdated) {
      items.push({
        content_type: ContentType.CHANGE_USER_ASSIGN,
        user: new User({ id: updateBoardDto.assigned_to_user_id }),
      });
    }
    if (generanData) {
      items.push({
        content_type: ContentType.CHANGE_GENERAL_DATA,
      });
    }

    return items;
  }
}
