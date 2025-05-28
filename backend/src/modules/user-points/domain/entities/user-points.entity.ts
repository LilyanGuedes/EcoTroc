export class UserPoints {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly collectionId: string,
    public readonly points: number,
    public readonly createdAt: Date,
  ) {}
}
