import { Points } from '../../../collection/domain/value-objects/points.vo';
import { v4 as uuidv4 } from 'uuid';

export enum TransactionType {
  COLLECTION = 'COLLECTION',
  REDEMPTION = 'REDEMPTION',
  BONUS = 'BONUS',
}

export class UserPoints {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _collectionId: string | null,
    private readonly _points: Points,
    private readonly _transactionType: TransactionType,
    private readonly _description: string,
    private readonly _createdAt: Date,
  ) {}

  static createFromCollection(params: {
    userId: string;
    collectionId: string;
    points: number;
    description?: string;
  }): UserPoints {
    const id = uuidv4();
    const points = Points.create(params.points);

    return new UserPoints(
      id,
      params.userId,
      params.collectionId,
      points,
      TransactionType.COLLECTION,
      params.description || `Points earned from collection ${params.collectionId}`,
      new Date(),
    );
  }

  static createRedemption(params: {
    userId: string;
    points: number;
    description: string;
  }): UserPoints {
    const id = uuidv4();
    const points = Points.create(-Math.abs(params.points)); // Sempre negativo para resgates

    return new UserPoints(
      id,
      params.userId,
      null,
      points,
      TransactionType.REDEMPTION,
      params.description,
      new Date(),
    );
  }

  static createBonus(params: {
    userId: string;
    points: number;
    description: string;
  }): UserPoints {
    const id = uuidv4();
    const points = Points.create(params.points);

    return new UserPoints(
      id,
      params.userId,
      null,
      points,
      TransactionType.BONUS,
      params.description,
      new Date(),
    );
  }

  static reconstitute(params: {
    id: string;
    userId: string;
    collectionId: string | null;
    points: number;
    transactionType: TransactionType;
    description: string;
    createdAt: Date;
  }): UserPoints {
    return new UserPoints(
      params.id,
      params.userId,
      params.collectionId,
      Points.create(params.points),
      params.transactionType,
      params.description,
      params.createdAt,
    );
  }

  isCollection(): boolean {
    return this._transactionType === TransactionType.COLLECTION;
  }

  isRedemption(): boolean {
    return this._transactionType === TransactionType.REDEMPTION;
  }

  isBonus(): boolean {
    return this._transactionType === TransactionType.BONUS;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get collectionId(): string | null {
    return this._collectionId;
  }

  get points(): number {
    return this._points.getValue();
  }

  get transactionType(): TransactionType {
    return this._transactionType;
  }

  get description(): string {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      collectionId: this._collectionId,
      points: this.points,
      transactionType: this._transactionType,
      description: this._description,
      createdAt: this._createdAt,
    };
  }
}
