import { Injectable } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupDto } from './dto/get-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { GROUP_PAGINATION_CONFIG } from './pagination-config';
import { Group, Label } from '@app/task';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = new Group({
      ...createGroupDto,
      label: new Label({ id: createGroupDto.label_id }),
    });

    const result = await this.groupsRepository.create(group);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.groupsRepository.entityRepository,
      GROUP_PAGINATION_CONFIG,
    );
  }

  async findOne(groupDto: GetGroupDto) {
    return this.groupsRepository.findOne(groupDto, {
      label: true,
    });
  }

  async read(groupDto: GetGroupDto) {
    return this.groupsRepository.findOne(groupDto);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const updateData: Partial<Group> = {
      ...updateGroupDto,
    };
    if (updateGroupDto?.label_id) {
      updateData.label = new Label({ id: updateGroupDto.label_id });
    }

    const result = await this.groupsRepository.findOneAndUpdate(
      { id },
      { ...updateData },
    );

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.groupsRepository.findOneAndDelete({ id });
  }
}
