export class BoardCreatedEvent {
  constructor(public readonly board: any) {}
}

export class BoardUpdatedEvent extends BoardCreatedEvent {}
