import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  DeliveryCreatedEvent,
  DeliveryPricingType,
  DeliveryStatus,
  EVENT_NAME_DELIVERY_CREATED,
  EVENT_NAME_ORDER_CONFIRMED,
  EVENT_NAME_ORDER_CREATED,
  EVENT_NAME_ORDER_REGENERATE_INVOICE,
  EVENT_NAME_ORDER_REJECTED,
  FILE_SERVICE,
  IdentifierQuery,
  NOTIFICATION_SERVICE,
  OrderConfirmedEvent,
  OrderCreatedEvent,
  OrderRegenerateInvoiceEvent,
  OrderRejectedEvent,
  OrderStatus,
  bankIdentificationNumber,
  calculateCostPerDistance,
  dueDateCalculate,
  getPaginationConfig,
  getTomorrowDate,
} from '@app/common';
import { OrdersRepository } from './orders.repository';
import { GetOrderDto } from './dto/get-order.dto';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsService } from '../products/products.service';
import { UpdateIsPaidOrderDto } from './dto/update-paid-orders.dto';
import { SettingsService } from '../settings/settings.service';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { ORDER_PAGINATION_CONFIG } from './pagination-config';
import { ContactsService } from '../contacts/contacts.service';
import { ConfigService } from '@nestjs/config';
import { RejectOrderDto } from './dto/reject-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/items/update-order-item.dto';
import { CreateOrderDeliveryDto } from './dto/delivery/create-order-delivery.dto';
import { UpdateOrderDeliveryDto } from './dto/delivery/update-order-delivery.dto';
import { RejectOrderDeliveryDto } from './dto/delivery/reject-order-delivery.dto';
import {
  Contact,
  ContactData,
  Delivery,
  DeliveryMethod,
  DeliveryMethodAreaRule,
  Order,
  OrderItem,
  Product,
  User,
} from '@app/store';
import { ClientProxy } from '@nestjs/microservices';
import { randomBytes } from 'crypto';
import { CreateOrderForOtherUserDto } from './dto/create-order-for-other-user.dto';
import { DeliveryMethodsService } from '../delivery-methods/delivery-methods.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsService: ProductsService,
    private readonly settingsService: SettingsService,
    private readonly contactsService: ContactsService,
    private readonly deliveryMethodsService: DeliveryMethodsService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
    @Inject(FILE_SERVICE)
    private readonly fileClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    const due_date = dueDateCalculate();
    let result;

    await this.ordersRepository.runInTransaction(async () => {
      // read setting
      const setting = await this.settingsService.getSystemSetting();
      const {
        tax_rate_default,
        invoice_number_pre_part,
        invoice_number_multiple,
      } = setting;

      //
      const user_id = user.id;
      const {
        delivery_method_id,
        delivery_method_area_rule_area_name,
        contact_id,
        billing_contact_id,
        order_items: order_items_input,
        discount_percentage,
        note,
      } = createOrderDto;

      // Read Contact
      const contact_data = await this.contactsService.findOne(
        { id: contact_id },
        { user_id },
      );

      // Read Billing Contact
      let billing_contact_data;
      if (billing_contact_id) {
        billing_contact_data = await this.contactsService.findOneNoCheck(
          { id: billing_contact_id },
          { user_id },
        );
      }

      // Read Delivery Method
      const delivery_method = await this.deliveryMethodsService.findOne({
        id: delivery_method_id,
      });

      //
      let subtotal = 0;
      const items_to_calculate_prices = [];
      const order_items = await Promise.all(
        order_items_input.map(async (item) => {
          const { product_id } = item;

          // read product
          const product = await this.productsService.read(
            {
              id: product_id,
            },
            { packaging_cost: true },
          );

          if (!product) {
            throw new NotFoundException('Product Not Found');
          }
          const orderItem = new OrderItem({});

          // subtotal
          subtotal += product.sale_price * item.quantity;

          orderItem.product = new Product({ id: item.product_id });
          orderItem.sale_price = product.sale_price;
          orderItem.quantity = item.quantity;

          items_to_calculate_prices.push({
            ...orderItem,
            packaging_cost: product.packaging_cost,
          });

          return orderItem;
        }),
      );

      // order
      const order = new Order({});
      order.user = new User({ id: user_id });
      order.subtotal = subtotal;
      order.order_items = order_items;

      order.contact = new Contact({
        id: contact_data.id,
      });
      order.contact_snapshot = this.mapContactToSnapshot(contact_data);

      if (billing_contact_data) {
        order.billing_contact = new Contact({
          id: billing_contact_data.id,
        });
        order.billing_contact_snapshot =
          this.mapContactToSnapshot(billing_contact_data);
      }

      // delivery
      order.delivery = new Delivery({
        delivery_method: new DeliveryMethod({ id: delivery_method.id }),
        delivery_method_area_rule_area_name,
        delivery_type: delivery_method.delivery_type,
        delivery_address: contact_data.address,
        delivery_city: contact_data.city,
        delivery_postal_code: contact_data.postal_code,
        delivery_latitude: contact_data.latitude,
        delivery_longitude: contact_data.longitude,
        recipient_name: contact_data.name,
        recipient_national_id: contact_data.national_code,
        recipient_phone_number: contact_data.phone,
        recipient_mobile_phone_number: contact_data.mobile_phone,
        delivery_status: DeliveryStatus.CONFIRMED,

        user: new User({ id: user_id }),
        // delivery_note:
      });

      // delivery date
      order.delivery_date = getTomorrowDate();

      order.tax_rate_percentage = tax_rate_default;
      order.note = note;
      order.due_date = due_date;

      // discount percentage
      order.discount_percentage = discount_percentage;

      // calculate prices
      const {
        packaging_cost,
        delivery_cost,
        discount_amount,
        tax_amount,
        total,
        round_amount,
      } = this.calculatePrices(
        order.tax_rate_percentage,
        items_to_calculate_prices,
        delivery_method,
        delivery_method.delivery_method_area_rules?.find(
          (areaRule) =>
            areaRule?.area_name === delivery_method_area_rule_area_name,
        ),
        setting.delivery_center_latitude,
        setting.delivery_center_longitude,
        contact_data.latitude,
        contact_data.longitude,
      );

      // packaging cost
      order.packaging_cost = packaging_cost;

      // delivery cost
      order.delivery_cost = delivery_cost;

      // discount
      order.discount_amount = discount_amount;

      // tax
      order.tax_amount = tax_amount;

      // total
      order.total = total;

      // rounding
      order.round_amount = round_amount;

      // Save the order to generate the ID
      const savedOrder = await this.ordersRepository.create(order);

      order.order_invoice_number =
        invoice_number_pre_part * invoice_number_multiple + savedOrder.id;

      // Adding Confirmation Data
      this.addConfirmatinDataToOrder(order);

      result = await this.ordersRepository.save(order);
    });

    const order = await this.findOne({ id: result.id }, { user_id: user.id });

    const order_link = this.configService.get('WEBSITE_ORDERS_LINK');

    this.notficationClient.emit(
      EVENT_NAME_ORDER_CREATED,
      new OrderCreatedEvent(order),
    );
    this.notficationClient.emit(
      EVENT_NAME_ORDER_CONFIRMED,
      new OrderConfirmedEvent(order, order_link),
    );
    this.fileClient.emit(
      EVENT_NAME_ORDER_CONFIRMED,
      new OrderConfirmedEvent(order, order_link),
    );

    return order;
  }

  async createForOtherUser(
    createOrderForOtherUserDto: CreateOrderForOtherUserDto,
  ) {
    return this.create(createOrderForOtherUserDto, {
      id: createOrderForOtherUserDto.user_id,
    } as User);
  }

  async findAll(query: PaginateQuery, identifierQuery: IdentifierQuery) {
    return paginate(
      query,
      this.ordersRepository.entityRepository,
      getPaginationConfig(ORDER_PAGINATION_CONFIG, identifierQuery),
    );
  }

  async findOne(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.ordersRepository.findOne(
      { ...orderDto, ...identifierQuery },
      {
        user: true,
        order_items: {
          product: {
            category: true,
          },
        },
        contact: true,
        billing_contact: true,
        confirmed_rejected_by: true,
        payments: true,
        delivery: {
          confirmed_rejected_by: true,
        },
      },
    );
  }

  async findOneWithoutJoin(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
    relations?: object,
  ) {
    return relations
      ? this.ordersRepository.findOne(
          { ...orderDto, ...identifierQuery },
          relations,
        )
      : this.ordersRepository.findOne({ ...orderDto, ...identifierQuery });
  }

  async findOneWithUserData(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.ordersRepository.findOne(
      { ...orderDto, ...identifierQuery },
      {
        user: true,
      },
    );
  }

  async findOneWithOrderItemsData(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
  ) {
    return this.ordersRepository.findOne(
      { ...orderDto },
      {
        order_items: true,
      },
    );
  }

  async update(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    updateOrderDto: UpdateOrderDto,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    const order = await this.findOneWithoutJoin(
      { ...orderDto },
      identifierQuery,
      {
        order_items: {
          product: {
            packaging_cost: true,
          },
        },
        delivery: {
          delivery_method: true,
        },
        contact: true,
      },
    );

    const { delivery_date, discount_percentage, note } = updateOrderDto;

    //
    order.delivery_date = delivery_date ?? order.delivery_date;
    order.note = note ?? order.note;

    //
    if (discount_percentage >= 0) {
      // discount percentage
      order.discount_percentage = discount_percentage;

      // read setting
      const setting = await this.settingsService.getSystemSetting();

      //
      const items_to_calculate_prices = order.order_items.map((item) => {
        return {
          sale_price: item.sale_price,
          quantity: item.quantity,
          packaging_cost: item.product.packaging_cost,
        };
      });

      //
      const areaRules =
        order.delivery?.delivery_method?.delivery_method_area_rules?.find(
          (area) =>
            area.area_name ===
            order.delivery.delivery_method_area_rule_area_name,
        );

      // calculate prices
      const { discount_amount, tax_amount, total, round_amount } =
        this.calculatePrices(
          order.tax_rate_percentage,
          items_to_calculate_prices,
          order.delivery.delivery_method,
          areaRules,
          setting.delivery_center_latitude,
          setting.delivery_center_longitude,
          order.contact.latitude,
          order.contact.longitude,
        );

      // discount
      order.discount_amount = discount_amount;

      // tax
      order.tax_amount = tax_amount;

      // total
      order.total = total;

      // rounding
      order.round_amount = round_amount;
    }

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async updateIsPaid(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    updateOrderDto: UpdateIsPaidOrderDto,
    identifierQuery: IdentifierQuery,
  ) {
    return this.ordersRepository.findOneAndUpdate(
      { ...orderDto, ...identifierQuery },
      updateOrderDto,
    );
  }

  async remove(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    return this.ordersRepository.findOneAndDelete({
      ...orderDto,
      ...identifierQuery,
    });
  }

  async clearItems(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    const order = await this.ordersRepository.findOne(
      { ...orderDto, ...identifierQuery },
      {
        order_items: true,
      },
    );

    await Promise.all(
      order.order_items?.map(async (orderItem) => {
        await this.orderItemsRepository.findOneAndDelete({ id: orderItem.id });
      }),
    );

    // await this.ordersRepository.findOneAndUpdate(
    //   { ...orderDto, user_id: user.id },
    //   { total_bill_amount: 0 },
    // );

    return;
  }

  async confirmOrder(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    let order = await this.findOneWithoutJoin({ ...orderDto }, identifierQuery);

    // Adding Confirmation Data
    this.addConfirmatinDataToOrder(order, identifierQuery.user_id);

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    order = await this.findOne({ id: result.id }, identifierQuery);

    const order_link = this.configService.get('WEBSITE_ORDERS_LINK');

    this.notficationClient.emit(
      EVENT_NAME_ORDER_CONFIRMED,
      new OrderConfirmedEvent(order, order_link),
    );
    this.fileClient.emit(
      EVENT_NAME_ORDER_CONFIRMED,
      new OrderConfirmedEvent(order, order_link),
    );

    return order;
  }

  async rejectOrder(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    rejectOrderDto: RejectOrderDto,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    let order = await this.findOneWithoutJoin({ ...orderDto }, identifierQuery);

    order.order_status = OrderStatus.REJECTED;
    order.confirmed_rejected_by = new User({ id: identifierQuery.user_id });
    order.rejected_note = rejectOrderDto.rejected_note;

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    order = await this.findOne({ id: result.id }, identifierQuery);

    this.notficationClient.emit(
      EVENT_NAME_ORDER_REJECTED,
      new OrderRejectedEvent(order),
    );

    return order;
  }

  async cancelOrder(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
  ) {
    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    const result = await this.ordersRepository.findOneAndUpdate(
      { ...orderDto, ...identifierQuery },
      { order_status: OrderStatus.CANCELLED },
    );

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async addNewItem(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    createOrderItemDto: CreateOrderItemDto,
    identifierQuery: IdentifierQuery,
  ) {
    const { product_id, quantity } = createOrderItemDto;

    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    // read product
    const product = await this.productsService.read({
      id: product_id,
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    // read order
    const order = await this.findOne({ ...orderDto }, identifierQuery);

    await this.ordersRepository.runInTransaction(async () => {
      // new Item
      const orderItem = new OrderItem({});
      orderItem.product = product;
      orderItem.sale_price = product.sale_price;
      orderItem.quantity = quantity;

      order.order_items = order.order_items.concat(orderItem);

      // update subtotal
      order.subtotal =
        +order.subtotal + +orderItem.sale_price * +orderItem.quantity;

      // calculate prices
      const { discount_amount, tax_amount, total, round_amount } =
        this.calculatePrices(order.tax_rate_percentage, order.order_items);

      // discount
      order.discount_amount = discount_amount;

      // tax
      order.tax_amount = tax_amount;

      // total
      order.total = total;

      // rounding
      order.round_amount = round_amount;

      await this.ordersRepository.save(order);
    });

    return this.findOne({ ...orderDto }, identifierQuery);
  }

  async editItem(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    order_item_id: number,
    updateOrderItemDto: UpdateOrderItemDto,
    identifierQuery: IdentifierQuery,
  ) {
    const { product_id, quantity } = updateOrderItemDto;

    await this.checkOrderIsValidToEdit(orderDto, identifierQuery);

    // read product
    const product = await this.productsService.read({
      id: product_id,
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    // read order
    const order = await this.findOne({ ...orderDto }, identifierQuery);

    await this.ordersRepository.runInTransaction(async () => {
      // update Item
      const orderItem = order.order_items.find(
        (item) => item.id === order_item_id,
      );
      orderItem.product = product;
      orderItem.sale_price = product.sale_price;
      orderItem.quantity = quantity;

      // update subtotal
      order.subtotal =
        +order.subtotal + +orderItem.sale_price * +orderItem.quantity;

      // calculate prices
      const { discount_amount, tax_amount, total, round_amount } =
        this.calculatePrices(order.tax_rate_percentage, order.order_items);

      // discount
      order.discount_amount = discount_amount;

      // tax
      order.tax_amount = tax_amount;

      // total
      order.total = total;

      // rounding
      order.round_amount = round_amount;

      await this.ordersRepository.save(order);
    });

    return this.findOne({ ...orderDto }, identifierQuery);
  }

  async addDeliveryCondition(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    createOrderDeliveryDto: CreateOrderDeliveryDto,
    identifierQuery: IdentifierQuery,
  ) {
    const order = await this.findOne({ ...orderDto }, identifierQuery);

    if (order.delivery) {
      throw new ConflictException(
        'شما قبلا برای این سفارش مشخصات مورد نیاز برای حمل را ارسال کرده اید.',
      );
    }

    if (order.order_status !== OrderStatus.CONFIRMED) {
      throw new ConflictException(
        'پس از تایید پیش فاکتور امکان ارسال مشخصات حمل می باشد.',
      );
    }

    // delivery
    order.delivery = new Delivery({
      ...createOrderDeliveryDto,
      ...identifierQuery,
    });

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    const delivery = await this.findOne({ id: result.id }, identifierQuery);

    this.notficationClient.emit(
      EVENT_NAME_DELIVERY_CREATED,
      new DeliveryCreatedEvent(delivery),
    );

    return delivery;
  }

  async updateDeliveryCondition(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    delivery_id: number,
    updateOrderDeliveryDto: UpdateOrderDeliveryDto,
    identifierQuery: IdentifierQuery,
  ) {
    // read order
    const order = await this.findOne({ ...orderDto }, identifierQuery);
    const { delivery } = order;

    // user
    const user_id = order.user_id;

    if (
      delivery?.delivery_status !== DeliveryStatus.PENDING &&
      delivery?.delivery_status !== DeliveryStatus.REJECTED
    ) {
      throw new ConflictException(
        'فقط در حالت های درحال انتظار و یا رد شده امکان ویرایش مشخصات حمل و نقل می باشد.',
      );
    }

    // Update the existing delivery properties
    Object.assign(delivery, updateOrderDeliveryDto);
    delivery.delivery_status = DeliveryStatus.PENDING;
    delivery.user_id = user_id;

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async confirmDeliveryCondition(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    delivery_id: number,
    identifierQuery: IdentifierQuery,
  ) {
    // read order
    const order = await this.findOne({ ...orderDto }, identifierQuery);
    const { delivery } = order;

    if (!delivery) return;

    // Update the existing delivery properties
    delivery.delivery_status = DeliveryStatus.CONFIRMED;
    delivery.confirmed_rejected_by = new User({
      id: identifierQuery.user_id,
    });
    delivery.confirmation_date = new Date();

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async rejectDeliveryCondition(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    delivery_id: number,
    rejectOrderDeliveryDto: RejectOrderDeliveryDto,
    identifierQuery: IdentifierQuery,
  ) {
    // read order
    const order = await this.findOne({ ...orderDto }, identifierQuery);
    const { delivery } = order;

    if (!delivery) return;

    // Update the existing delivery properties
    delivery.delivery_status = DeliveryStatus.REJECTED;
    delivery.confirmed_rejected_by = new User({
      id: identifierQuery.user_id,
    });
    delivery.rejected_note = rejectOrderDeliveryDto.rejected_note;

    // Save the updated Order entity
    const result = await this.ordersRepository.save(order);

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async regenerateOrderInvoice(
    orderDto: Omit<GetOrderDto, 'order_items'>,
    identifierQuery: IdentifierQuery,
  ) {
    const order = await this.findOne({ ...orderDto }, identifierQuery);

    this.fileClient.emit(
      EVENT_NAME_ORDER_REGENERATE_INVOICE,
      new OrderRegenerateInvoiceEvent(order),
    );

    return;
  }

  private async checkOrderIsValidToEdit(
    orderDto: Omit<GetOrderDto, 'order_items' | 'payments'>,
    identifierQuery: IdentifierQuery,
  ) {
    const order = await this.ordersRepository.findOne({
      ...orderDto,
      ...identifierQuery,
    });

    // 1
    if (order.order_status !== OrderStatus.PENDING) {
      throw new ForbiddenException(
        'سفارش در وضعیت اولیه نمی باشد. امکان اصلاح این سفارش نیست.',
      );
    }
  }

  private calculatePrices = (
    tax_rate: number,
    items: {
      sale_price: number;
      quantity?: number;
      packaging_cost?: { id: number; cost: number; shared_packaging: boolean };
    }[],
    deliveryMethod?: DeliveryMethod | null,
    deliveryMethodAreaRule?: DeliveryMethodAreaRule,
    delivery_center_latitude?: number,
    delivery_center_longitude?: number,
    delivery_contact_latitude?: number,
    delivery_contact_longitude?: number,
  ): {
    discount_amount: number;
    tax_amount: number;
    round_amount: number;
    packaging_cost: number;
    delivery_cost: number;
    subtotal: number;
    total: number;
  } => {
    // Rounding Factor
    const rounding_factor = 1;

    // subtotal
    const subtotal = +items.reduce(
      (acc, item) => acc + (item?.sale_price || 0) * (item.quantity || 0),
      0,
    );

    // packaging cost
    const packaging_cost = this.calculateTotalPackagingCost(items);

    // delivery cost
    const delivery_cost = this.calculateDeliveryCost(
      deliveryMethod,
      deliveryMethodAreaRule,
      delivery_center_latitude,
      delivery_center_longitude,
      delivery_contact_latitude,
      delivery_contact_longitude,
    );

    // discount amount
    const discount_amount = 0;

    // tax amount
    const tax_amount =
      (subtotal + packaging_cost + delivery_cost) * (tax_rate / 100);

    //  total with tax, packaging, and delivery costs
    let totalWithExtras =
      subtotal + packaging_cost + delivery_cost + tax_amount;

    // Apply rounding
    const round_amount =
      rounding_factor > 0
        ? rounding_factor - (totalWithExtras % rounding_factor)
        : 0;
    totalWithExtras += Number(round_amount);

    return {
      discount_amount,
      tax_amount,
      round_amount,
      packaging_cost,
      delivery_cost,
      subtotal,
      total: totalWithExtras,
    };
  };

  private calculateTotalPackagingCost = (
    items: {
      packaging_cost?: { id: number; cost: number; shared_packaging: boolean };
    }[],
  ): number => {
    let packaging_cost = 0;
    const handledPackagingIds = new Set<number>();

    for (const item of items) {
      const costItem = item?.packaging_cost;

      if (!costItem) continue;

      // Skip if this packaging cost ID has already been handled
      if (handledPackagingIds.has(costItem.id)) continue;

      // Add the cost to the total
      packaging_cost += Number(costItem?.cost || 0);

      // If shared_packaging is true, mark the ID as handled and stop processing further for this group
      if (costItem.shared_packaging) {
        handledPackagingIds.add(costItem.id);
      }
    }

    return packaging_cost;
  };

  private calculateDeliveryCost = (
    deliveryMethod?: DeliveryMethod | null,
    deliveryMethodAreaRule?: DeliveryMethodAreaRule,
    delivery_center_latitude?: number,
    delivery_center_longitude?: number,
    delivery_contact_latitude?: number,
    delivery_contact_longitude?: number,
  ) => {
    let delivery_cost = 0;

    if (
      deliveryMethod?.delivery_pricing_type ===
        DeliveryPricingType.SELECTED_AREA &&
      deliveryMethod.delivery_method_area_rules?.length
    ) {
      delivery_cost = Number(deliveryMethodAreaRule?.price || 0);
    } else if (
      deliveryMethod?.delivery_pricing_type ===
      DeliveryPricingType.PER_KILOMETER
    ) {
      delivery_cost = calculateCostPerDistance(
        deliveryMethod?.fixed_price || 0,
        deliveryMethod?.per_kilometer || 0,
        [
          {
            latitude: delivery_center_latitude,
            longitude: delivery_center_longitude,
          },
          {
            latitude: delivery_contact_latitude,
            longitude: delivery_contact_longitude,
          },
        ],
      );
    } else {
      delivery_cost = Number(deliveryMethod?.fixed_price || 0);
    }

    return delivery_cost;
  };

  private addConfirmatinDataToOrder = (
    order: Order,
    confirmedUserId?: number,
  ) => {
    // Order Status
    order.order_status = OrderStatus.CONFIRMED;

    // Confirmed User
    if (confirmedUserId) {
      order.confirmed_rejected_by = new User({ id: confirmedUserId });
      order.is_confirmed_rejected_by_system = false;
    } else {
      order.is_confirmed_rejected_by_system = true;
    }

    // Bank Identifier Code
    order.order_bank_identifier_code = bankIdentificationNumber(
      order.order_invoice_number,
    );

    // Share Code (PDF)
    order.share_code = this.generateShareCode(order.order_invoice_number);
    order.pdf_file_name = `${order.share_code}.pdf`;
    order.pdf_file_url = `${this.configService.get('INVOICE_DOWNLOAD_URL')}${order.pdf_file_name}`;
  };

  private generateShareCode = (order_invoice_number: number): string => {
    // Generate a secure random number between 1000 and 9999
    const randomBuffer = randomBytes(2); // 2 bytes = 16 bits, enough to cover the range 0 to 65535
    const randomNumber = (randomBuffer.readUInt16BE(0) % 9000) + 1000;

    // Combine the order invoice number and the secure random number to form the share code
    return `${order_invoice_number}-${randomNumber}`;
  };

  private mapContactToSnapshot(contact: Contact): ContactData {
    return {
      contact_type: contact.contact_type,
      title: contact.title,
      name: contact.name,
      phone: contact.phone,
      mobile_phone: contact.mobile_phone,
      address: contact.address,
      city: contact.city,
      postal_code: contact.postal_code,
      national_code: contact.national_code,
      economic_code: contact.economic_code,
      latitude: contact.latitude,
      longitude: contact.longitude,
    };
  }
}
