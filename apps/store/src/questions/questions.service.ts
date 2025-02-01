import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsRepository } from './questions.repository';
import { GetQuestionDto } from './dto/get-question.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { REVIEW_PAGINATION_CONFIG } from './pagination-config';
import { Answer, Product, Question, User } from '@app/store';
import {
  EVENT_NAME_QUESTION_CREATED,
  IdentifierQuery,
  NOTIFICATION_SERVICE,
  QuestionCreatedEvent,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, user: User) {
    // read Product
    const product = await this.productsService.findOne({
      id: createQuestionDto.product_id,
    });

    let question = new Question({ ...createQuestionDto });
    question.user = new User({ id: user.id });
    question.product = new Product({ id: product.id });
    question.product_code = product.product_code;

    let user_has_bought_product = false;
    try {
      const order = await this.ordersService.findOneWithoutJoin(
        { user_id: user.id, is_paid: true },
        {},
      );
      user_has_bought_product = !!order;
    } catch (error) {}

    question.user_has_bought_product = user_has_bought_product;

    question = await this.questionsRepository.create(question);

    this.notficationClient.emit(
      EVENT_NAME_QUESTION_CREATED,
      new QuestionCreatedEvent(question),
    );

    return question;
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.questionsRepository.entityRepository,
      REVIEW_PAGINATION_CONFIG,
    );
  }

  async findOne(questionDto: Omit<GetQuestionDto, 'product' | 'answers'>) {
    return this.questionsRepository.findOne(
      { ...questionDto },
      {
        product: true,
        user: true,
        answers: {
          user: true,
        },
      },
    );
  }

  async update(
    questionDto: Omit<GetQuestionDto, 'product' | 'answers'>,
    updateQuestionDto: UpdateQuestionDto,
    identifierQuery: IdentifierQuery,
  ) {
    const question = await this.findOne({ ...questionDto, ...identifierQuery });

    question.question_text =
      updateQuestionDto.question_text ?? question.question_text;

    const result = await this.questionsRepository.save(question);

    return this.findOne({ id: result.id });
  }

  async remove(
    questionDto: Omit<GetQuestionDto, 'product' | 'answers'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.questionsRepository.findOneAndDelete({
      ...questionDto,
      ...identifierQuery,
    });
  }

  async createAnswer(
    questionDto: Omit<GetQuestionDto, 'product' | 'answers'>,
    createAnswerDto: CreateAnswerDto,
    user: User,
  ) {
    // read Question
    const question = await this.findOne({ ...questionDto });

    const answer = new Answer({
      ...createAnswerDto,
      user: new User({ id: user.id }),
    });
    if (question?.answers?.length) {
      question.answers.push(answer);
    } else {
      question.answers = [answer];
    }

    const result = await this.questionsRepository.save(question);

    return this.findOne({ id: result.id });
  }
}
