export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
  BOTH = 'both',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  PAID = 'paid',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export enum PaymentType {
  RECEIPT = 'receipt',
  ONLINE = 'online',
}

export enum MaterialUnit {
  NUMBER = 'number',
  KILOGRAM = 'kg',
  METER = 'm',
  BOX = 'box',
  ROLL = 'roll',
  DEVICE = 'device',
}

export enum ProductType {
  UNKNOWN = 'unknown',
  ORIGINAL = 'original',
  COPY = 'copy',
  RENEW = 'renew',
}

export enum DeliveryType {
  POST_NORAMAL = 'post_normal',
  POST_FAST = 'post_fast',
  TIPAX = 'tipax',
  RIDER = 'rider',
  SELF_PICKUP = 'self_pickup',
}

export enum DeliveryChargeType {
  PREPAID = 'prepaid',
  COD = 'cod',
}

export enum DeliveryPricingType {
  FIXED = 'fixed',
  SELECTED_AREA = 'selected_area',
  PER_KILOMETER = 'per_kilometer',
}

export enum DeliveryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionNote {
  DISCOUNT_PROFIT = 'discount_profit',
}

export enum OperatorType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export enum CommentType {
  ACTIVITY = 'activity',
  COMMENT = 'comment',
}

export enum ContentType {
  USER_COMMENT = 'user_comment',
  NEW_GROUP = 'new_group',
  CHANGE_USER_ASSIGN = 'change_user_assign',
  CHANGE_GENERAL_DATA = 'change_general_data',
}

export enum EndpointMethodType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum MessageType {
  DEFAULT = 'default',
  NEW_ORDER = 'new_order',
  NEW_PAYMENT = 'new_payment',
  NEW_DELIVERY = 'new_delivery',
  NEW_BOARD = 'new_board',
  EDIT_BOARD = 'edit_board',
  NEW_REVIEW = 'new_review',
  NEW_QUESTION = 'new_question',
}

export enum MessageGroupType {
  DEFAULT = 'default',
  BOARD = 'board',
}

export enum RecommendationType {
  UNKNOWN = 'unknown',
  RECOMMENDED = 'recommended',
  NOT_RECOMMENDED = 'not_recommended',
  NOT_SURE = 'not_sure',
}

export enum SmsTitleType {
  CODE_ACCOUNT_1 = 'code_account_1',
  CODE_ACCOUNT_2 = 'code_account_2',
  CODE_ACCOUNT_3 = 'code_account_3',
  CODE_ACCOUNT_4 = 'code_account_4',
  CODE_ACCOUNT_5 = 'code_account_5',
  CODE_ORDER_1 = 'code_order_1',
  CODE_ORDER_2 = 'code_order_2',
  CODE_ORDER_3 = 'code_order_3',
  CODE_ORDER_4 = 'code_order_4',
  CODE_ORDER_5 = 'code_order_5',
  CODE_ORDER_6 = 'code_order_6',
  CODE_PAYMENT_1 = 'code_payment_1',
  CODE_PAYMENT_2 = 'code_payment_2',
  CODE_PAYMENT_3 = 'code_payment_3',
  CODE_PAYMENT_4 = 'code_payment_4',
  CODE_PAYMENT_5 = 'code_payment_5',
  CODE_PAYMENT_6 = 'code_payment_6',
  CODE_DELIVERY_1 = 'code_delivery_1',
  CODE_DELIVERY_2 = 'code_delivery_2',
  CODE_DELIVERY_3 = 'code_delivery_3',
  CODE_DELIVERY_4 = 'code_delivery_4',
  CODE_DELIVERY_5 = 'code_delivery_5',
  CODE_PROMOTION_1 = 'code_promotion_1',
  CODE_PROMOTION_2 = 'code_promotion_2',
  CODE_SUPPORT_1 = 'code_support_1',
  CODE_SUPPORT_2 = 'code_support_2',
  CODE_SUPPORT_3 = 'code_support_3',
  CODE_INTERNAL_1 = 'code_internal_1',
  CODE_INTERNAL_2 = 'code_internal_2',
  CODE_INTERNAL_3 = 'code_internal_3',
}

export enum ContactType {
  INDIVIDUAL = 'individual',
  ENTERPRISE = 'enterprise',
}
