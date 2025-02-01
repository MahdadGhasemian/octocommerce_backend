export class PaymentCreatedEvent {
  constructor(public readonly payment: any) {}
}

export class PaymentConfirmedEvent {
  constructor(
    public readonly payment: any,
    public readonly totalPaidAmount: number,
    public readonly totalRemainedAmount: number,
  ) {}
}

export class PaymentRejectedEvent {
  constructor(public readonly payment: any) {}
}

export class PaymentCompletedEvent {
  constructor(
    public readonly payment: any,
    public readonly totalPaidAmount: number,
    public readonly totalRemainedAmount: number,
  ) {}
}
