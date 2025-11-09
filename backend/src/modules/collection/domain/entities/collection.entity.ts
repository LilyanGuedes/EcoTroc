import { MaterialType } from '../value-objects/material-type.vo';
import { Points } from '../value-objects/points.vo';
import { Quantity } from '../value-objects/quantity.vo';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent } from 'src/shared/domain/domain-event.base';
import { AggregateRoot } from 'src/shared/domain/aggregate-root.base';

export enum CollectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// Domain Events
export class CollectionCreatedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly userId: string,
    public readonly operatorId: string,
    public readonly materialType: string,
    public readonly quantity: number,
    public readonly points: number,
  ) {
    super();
  }
}

export class CollectionAcceptedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly userId: string,
    public readonly points: number,
  ) {
    super();
  }
}

export class CollectionRejectedEvent extends DomainEvent {
  constructor(
    public readonly collectionId: string,
    public readonly userId: string,
    public readonly reason?: string,
  ) {
    super();
  }
}

// Aggregate Root Collection
export class Collection extends AggregateRoot {
  private _status: CollectionStatus = CollectionStatus.PENDING;
  private _respondedAt?: Date;
  private _points: Points;
  private _description?: string;

  private constructor(
    private readonly _id: string,
    private readonly _operatorId: string,
    private readonly _userId: string,
    private readonly _materialType: MaterialType,
    private readonly _quantity: Quantity,
    private readonly _createdAt: Date,
    description?: string,
  ) {
    super();
    this._points = this.calculatePoints();
    this._description = description;
  }

  static create(params: {
    operatorId: string;
    userId: string;
    materialType: string;
    quantity: number;
    description?: string;
  }): Collection {
    const id = uuidv4();
    const materialType = MaterialType.from(params.materialType);
    const quantity = Quantity.create(params.quantity);

    const collection = new Collection(
      id,
      params.operatorId,
      params.userId,
      materialType,
      quantity,
      new Date(),
      params.description,
    );

    // Emitir evento de domínio
    collection.addDomainEvent(
      new CollectionCreatedEvent(
        id,
        params.userId,
        params.operatorId,
        params.materialType,
        params.quantity,
        collection._points.getValue(),
      ),
    );

    return collection;
  }

  static reconstitute(params: {
    id: string;
    operatorId: string;
    userId: string;
    materialType: string;
    quantity: number;
    points: number;
    createdAt: Date;
    status: CollectionStatus;
    respondedAt?: Date;
    description?: string;
  }): Collection {
    const collection = new Collection(
      params.id,
      params.operatorId,
      params.userId,
      MaterialType.from(params.materialType),
      Quantity.create(params.quantity),
      params.createdAt,
      params.description,
    );

    collection._status = params.status;
    collection._respondedAt = params.respondedAt;
    collection._points = Points.create(params.points);

    return collection;
  }

  private calculatePoints(): Points {
    const pointsPerUnit = this._materialType.getPointsPerUnit();
    const totalPoints = this._quantity.multiply(pointsPerUnit);
    return Points.create(totalPoints);
  }

  acceptBy(userId: string): void {
    if (this._userId !== userId) {
      throw new Error('Only the collection owner can accept it');
    }

    if (this._status !== CollectionStatus.PENDING) {
      throw new Error('Collection has already been responded to');
    }

    this._status = CollectionStatus.ACCEPTED;
    this._respondedAt = new Date();

    // Emitir evento de domínio
    this.addDomainEvent(
      new CollectionAcceptedEvent(
        this._id,
        this._userId,
        this._points.getValue(),
      ),
    );
  }

  rejectBy(userId: string, reason?: string): void {
    if (this._userId !== userId) {
      throw new Error('Only the collection owner can reject it');
    }

    if (this._status !== CollectionStatus.PENDING) {
      throw new Error('Collection has already been responded to');
    }

    this._status = CollectionStatus.REJECTED;
    this._respondedAt = new Date();

    // Emitir evento de domínio
    this.addDomainEvent(
      new CollectionRejectedEvent(this._id, this._userId, reason),
    );
  }

  get id(): string {
    return this._id;
  }

  get operatorId(): string {
    return this._operatorId;
  }

  get userId(): string {
    return this._userId;
  }

  get materialType(): string {
    return this._materialType.toString();
  }

  get quantity(): number {
    return this._quantity.getValue();
  }

  get points(): number {
    return this._points.getValue();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get status(): CollectionStatus {
    return this._status;
  }

  get respondedAt(): Date | undefined {
    return this._respondedAt;
  }

  get description(): string | undefined {
    return this._description;
  }

  isPending(): boolean {
    return this._status === CollectionStatus.PENDING;
  }

  isAccepted(): boolean {
    return this._status === CollectionStatus.ACCEPTED;
  }

  toJSON() {
    return {
      id: this._id,
      operatorId: this._operatorId,
      userId: this._userId,
      materialType: this.materialType,
      quantity: this.quantity,
      points: this.points,
      createdAt: this._createdAt,
      status: this._status,
      respondedAt: this._respondedAt,
      description: this._description,
    };
  }
}
