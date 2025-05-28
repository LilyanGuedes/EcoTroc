export class Collection {
  constructor(
    public readonly id: string,
    public readonly operatorId: string,
    public readonly recyclerNickname: string,
    public readonly materialType: string,
    public readonly quantity: number,
    public readonly points: number,
    public readonly createdAt: Date,
    public receivedAt?: Date,
    public received: boolean = false,
  ) {}
}
