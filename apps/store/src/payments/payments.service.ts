import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  AvailableQuantityUpdateByOrderingEvent,
  EVENT_NAME_AVAILABLE_QUANTITY_BY_ORDERING_UPDATE,
  EVENT_NAME_PAYMENT_COMPLETED,
  EVENT_NAME_PAYMENT_CONFIRMED,
  EVENT_NAME_PAYMENT_CREATED,
  EVENT_NAME_PAYMENT_REJECTED,
  IdentifierQuery,
  NOTIFICATION_SERVICE,
  OrderStatus,
  PaymentCompletedEvent,
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
  PaymentRejectedEvent,
  PaymentStatus,
  PaymentType,
  STORE_SERVICE,
  SedadProvider,
  getPaginationConfig,
} from '@app/common';
import { PaymentsRepository } from './payments.repository';
import { GetPaymentDto } from './dto/get-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { PAYMENT_PAGINATION_CONFIG } from './pagination-config';
import { RejectPaymentDto } from './dto/reject-payment.dto';
import { Order, Payment, PaymentProviderDataInterface, User } from '@app/store';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SadadResultPaymentDto } from './dto/sadad-result-payment.dto';
import { CreatePaymentForOtherUserDto } from './dto/create-payment-for-other-user.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersService: OrdersService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
    @Inject(STORE_SERVICE)
    private readonly storeClient: ClientProxy,
    private readonly sedadProvider: SedadProvider,
    private readonly configService: ConfigService,
  ) {}

  protected readonly logger = new Logger(PaymentsService.name);

  async create(createPaymentDto: CreatePaymentDto, user: User) {
    // Payment Type
    const payment_type = createPaymentDto.payment_type;

    // Payment Amount
    const amount = createPaymentDto.amount;
    const payment_amount = amount * 10;

    // Find Order
    const order = await this.ordersService.findOneWithUserData(
      {
        id: createPaymentDto.order_id,
      },
      { user_id: user.id },
    );

    // Check Some Payment Validations
    this.checkPaymentValidation(payment_type, amount, order);

    // Generate PaymentOrderId
    const payment_order_id = this.generatePaymentOrderId();

    // Payment Provider Data
    let payment_provider_data: PaymentProviderDataInterface;
    let redirect_url;

    // Online Payment
    if (payment_type === PaymentType.ONLINE) {
      const return_url = this.configService.get('PAYMENT_SADAD_RETURN_URL');
      const user_mobile_phone = order.user.mobile_phone;

      try {
        const { token, url } = await this.sedadProvider.requestPayment({
          amount: payment_amount,
          returnUrl: return_url,
          mobile: user_mobile_phone,
          orderId: payment_order_id,
        });

        payment_provider_data = {
          amount,
          payment_amount,
          return_url,
          user_mobile_phone,
          payment_order_id,
          token,
        };

        redirect_url = `${url}?TOKEN=${token}`;
      } catch (error) {
        this.logger.error(
          `Request Payment Sadad PSP Error: ${error?.code} - ${error?.message}`,
        );

        throw new ConflictException(
          'در مرحله ارتباط با بانک مشکلی پیش امده است، لطفا مجددا تلاش نمایید!',
        );
      }
    }

    // payment
    let payment = new Payment({
      ...createPaymentDto,
      payment_status: PaymentStatus.PENDING,
      user_id: user.id,
      payment_order_id,
      payment_provider_data,
    });

    const result = await this.paymentsRepository.create(payment);

    payment = await this.findOne({ id: result.id }, { user_id: user.id });

    this.notficationClient.emit(
      EVENT_NAME_PAYMENT_CREATED,
      new PaymentCreatedEvent(payment),
    );

    return {
      ...payment,
      redirect_url,
    };
  }

  async createForOtherUser(
    createPaymentForOtherUserDto: CreatePaymentForOtherUserDto,
  ) {
    if (createPaymentForOtherUserDto.payment_type === PaymentType.ONLINE) {
      throw new BadRequestException(
        'امکان انتخاب پرداخت آنلاین برای کاربر دیگر نیست!',
      );
    }

    return this.create(
      {
        ...createPaymentForOtherUserDto,
      },
      {
        id: createPaymentForOtherUserDto.user_id,
      } as User,
    );
  }

  async findAll(query: PaginateQuery, identifierQuery: IdentifierQuery) {
    return paginate(
      query,
      this.paymentsRepository.entityRepository,
      getPaginationConfig(PAYMENT_PAGINATION_CONFIG, identifierQuery),
    );
  }

  async findOne(
    paymentDto: Omit<GetPaymentDto, 'order'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.paymentsRepository.findOne(
      { ...paymentDto, ...identifierQuery },
      {
        user: true,
        confirmed_rejected_by: true,
        order: {
          order_items: true,
        },
      },
    );
  }

  async confirmPayment(paymentDto: GetPaymentDto, user: User) {
    await this.checkPaymentIsValidToEdit(paymentDto, {});

    let payment = await this.findOne({ ...paymentDto }, {});
    const { amount, order, order_id } = payment;

    // user
    const user_id = payment.user_id;

    payment.payment_status = PaymentStatus.CONFIRMED;
    payment.confirmed_rejected_by = new User({
      id: user.id,
    });

    //
    let result;
    const totalAlreadyPaid = await this.paymentsRepository.sum('amount', {
      order_id,
      payment_status: PaymentStatus.CONFIRMED,
    });

    const total = +order?.total || 0;
    const newAmount = +amount || 0;
    const totalPaidAmount = +totalAlreadyPaid || 0 + +newAmount || 0;
    const totalRemainedAmount = total - totalPaidAmount;
    const isCompleted = totalPaidAmount + newAmount >= total;

    //
    await this.paymentsRepository.runInTransaction(async () => {
      // order
      if (isCompleted) {
        await this.ordersService.updateIsPaid(
          { id: order.id },
          { is_paid: true },
          { user_id },
        );
      }

      // payment
      result = await this.paymentsRepository.save(payment);
    });
    //

    payment = await this.findOne({ id: result.id }, {});

    if (isCompleted) {
      this.notficationClient.emit(
        EVENT_NAME_PAYMENT_COMPLETED,
        new PaymentCompletedEvent(
          payment,
          totalPaidAmount,
          totalRemainedAmount,
        ),
      );
    } else {
      this.notficationClient.emit(
        EVENT_NAME_PAYMENT_CONFIRMED,
        new PaymentConfirmedEvent(
          payment,
          totalPaidAmount,
          totalRemainedAmount,
        ),
      );
    }

    return payment;
  }

  async rejectPayment(
    paymentDto: GetPaymentDto,
    rejectPaymentDto: RejectPaymentDto,
    user: User,
  ) {
    await this.checkPaymentIsValidToEdit(paymentDto, {});

    let payment = await this.findOne({ ...paymentDto }, {});

    payment.payment_status = PaymentStatus.REJECTED;
    payment.confirmed_rejected_by = new User({
      id: user.id,
    });
    payment.rejected_note = rejectPaymentDto.rejected_note;

    // Save the updated Payment entity
    const result = await this.paymentsRepository.save(payment);

    payment = await this.findOne({ id: result.id }, {});

    this.notficationClient.emit(
      EVENT_NAME_PAYMENT_REJECTED,
      new PaymentRejectedEvent(payment),
    );

    return payment;
  }

  async update(
    paymentDto: Omit<GetPaymentDto, 'order'>,
    updatePaymentDto: UpdatePaymentDto,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkPaymentIsValidToEdit(paymentDto, identifierQuery);

    const result = await this.paymentsRepository.findOneAndUpdate(
      { ...paymentDto, ...identifierQuery },
      updatePaymentDto,
    );

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async remove(
    paymentDto: Omit<GetPaymentDto, 'order'>,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkPaymentIsValidToEdit(paymentDto, identifierQuery);

    return this.paymentsRepository.findOneAndDelete({
      ...paymentDto,
      ...identifierQuery,
    });
  }

  async resultSadad(sadadResultPaymentDto: SadadResultPaymentDto) {
    const redirect_to_website_url = this.configService.get(
      'PAYMENT_REDIRECT_TO_WEBSITE_URL',
    );

    const {
      OrderId,
      HashedCardNo,
      ResCode,
      token: Token,
    } = sadadResultPaymentDto;
    const payment_order_id = OrderId;

    let payment = await this.paymentsRepository.findOneNoCheck(
      {
        payment_order_id,
      },
      {
        order: true,
      },
    );

    if (!payment) {
      throw new NotFoundException('پرداختی با مشخصات ارسالی یافت نشد!');
    }

    const { order, user_id } = payment;

    // Call Verify
    try {
      const { transactionId, cardPan, retrivalRefNo } =
        await this.sedadProvider.verifyPayment({
          HashedCardNo,
          ResCode,
          Token,
        });

      payment.payment_status = PaymentStatus.CONFIRMED;
      payment.payment_provider_data = {
        ...payment.payment_provider_data,

        hashed_card_number: HashedCardNo,
        transaction_id: transactionId,
        card_pin: cardPan,
        retrival_ref_number: retrivalRefNo,
      };

      //
      await this.paymentsRepository.runInTransaction(async () => {
        // order
        await this.ordersService.updateIsPaid(
          { id: order.id },
          { is_paid: true },
          { user_id },
        );

        // payment
        await this.paymentsRepository.save(payment);
      });
      //

      payment = await this.findOne({ id: payment.id }, {});

      this.notficationClient.emit(
        EVENT_NAME_PAYMENT_COMPLETED,
        new PaymentCompletedEvent(payment, payment.payment_amount, 0),
      );

      this.storeClient.emit(
        EVENT_NAME_AVAILABLE_QUANTITY_BY_ORDERING_UPDATE,
        new AvailableQuantityUpdateByOrderingEvent(order.id, true),
      );

      // Redirect to the UI payment
      return {
        url: `${redirect_to_website_url}?${new URLSearchParams({
          status: 'success',
          psp: 'sadad',
          order_id: order.id.toString(),
          payment_order_id: payment_order_id,
          amount: payment.amount.toString(),
          payment_amount: payment.payment_amount.toString(),
          transaction_id: transactionId,
          retrival_ref_number: retrivalRefNo,
        }).toString()}`,
      };
    } catch (error) {
      // Rejection
      this.logger.error(
        `Verify Payment Sadad PSP Error: ${error?.code} - ${error?.message}`,
      );

      // Redirect to the UI payment
      return {
        url: `${redirect_to_website_url}?${new URLSearchParams({
          status: 'error',
          psp: 'sadad',
          order_id: order.id.toString(),
          payment_order_id: payment_order_id,
          amount: payment.amount.toString(),
          payment_amount: payment.payment_amount.toString(),
        }).toString()}`,
      };
    }
  }

  private async checkPaymentIsValidToEdit(
    paymentDto: Omit<GetPaymentDto, 'order'>,
    identifierQuery: IdentifierQuery,
  ) {
    const payment = await this.paymentsRepository.findOne({
      ...paymentDto,
      ...identifierQuery,
    });

    if (payment.payment_status !== PaymentStatus.PENDING) {
      throw new ForbiddenException(
        'This payment is not on pending status, so you can not edit it.',
      );
    }
  }

  private checkPaymentValidation(
    payment_type: PaymentType,
    amount: number,
    order: Order,
  ) {
    // Check Order Status
    if (order.order_status === OrderStatus.PENDING) {
      throw new ConflictException(
        'امکان ثبت پرداخت قبل از تایید پیش فاکتور وجود ندارد!',
      );
    }

    // Online Payment
    if (payment_type === PaymentType.ONLINE) {
      if (amount === order.total) {
        throw new ConflictException(
          'مبلغ سفارش با مبلغ ارسالی برای پرداخت یکسان نیستند!',
        );
      }
    }
    // Receipt Payment
    else if (payment_type === PaymentType.RECEIPT) {
    }
  }

  private generatePaymentOrderId() {
    return Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  }
}
