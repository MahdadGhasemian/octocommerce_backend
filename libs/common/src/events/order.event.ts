export class OrderCreatedEvent {
  constructor(public readonly order: any) {}
}

export class DeliveryCreatedEvent {
  constructor(public readonly delivery: any) {}
}

export class OrderConfirmedEvent {
  constructor(
    public readonly order: any,
    public readonly order_link: string,
  ) {}
}

export class OrderRejectedEvent {
  constructor(public readonly order: any) {}
}

export class ReviewCreatedEvent {
  constructor(public readonly review: any) {}
}

export class QuestionCreatedEvent {
  constructor(public readonly question: any) {}
}

export class OrderRegenerateInvoiceEvent {
  constructor(public readonly order: any) {}
}
