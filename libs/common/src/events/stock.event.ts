export class AvailableQuantityUpdateByOrderingEvent {
  constructor(
    public readonly order_id: number,
    public readonly is_paid: boolean,
  ) {}
}

export class AvailableQuantityUpdateByRenewProcessEvent {
  constructor(
    public readonly product_id: number,
    public readonly available_quantity: number,
  ) {}
}
