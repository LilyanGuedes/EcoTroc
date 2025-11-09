import { RoleReference } from 'src/shared/domain/role-reference.enum';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Points } from '../../../collection/domain/value-objects/points.vo';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent } from 'src/shared/domain/domain-event.base';
import { AggregateRoot } from 'src/shared/domain/aggregate-root.base';

// Domain Events
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly role: RoleReference,
  ) {
    super();
  }
}

export class PointsAddedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly points: number,
    public readonly collectionId: string,
    public readonly totalBalance: number,
  ) {
    super();
  }
}

export class PointsRedeemedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly points: number,
    public readonly description: string,
    public readonly remainingBalance: number,
  ) {
    super();
  }
}

// Aggregate Root User
export class User extends AggregateRoot {
  private _pointsBalance: Points;

  private constructor(
    private readonly _id: string,
    private _name: string,
    private _email: Email,
    private _password: Password,
    private readonly _role: RoleReference,
    private _ecopointId?: string,
  ) {
    super();
    this._pointsBalance = Points.zero();
  }

  static async create(params: {
    name: string;
    email: string;
    password: string;
    role: RoleReference;
    ecopointId?: string;
  }): Promise<User> {
    const id = uuidv4();
    const email = new Email(params.email);
    const password = await Password.create(params.password);

    const user = new User(
      id,
      params.name,
      email,
      password,
      params.role,
      params.ecopointId,
    );

    // Emitir evento de domínio
    user.addDomainEvent(
      new UserRegisteredEvent(id, params.email, params.role),
    );

    return user;
  }

  static reconstitute(params: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: RoleReference;
    ecopointId?: string;
    pointsBalance: number;
  }): User {
    const user = new User(
      params.id,
      params.name,
      new Email(params.email),
      Password.fromHash(params.passwordHash),
      params.role,
      params.ecopointId,
    );

    user._pointsBalance = Points.create(params.pointsBalance);
    return user;
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return this._password.compare(plainPassword);
  }

  addPointsFromCollection(collectionId: string, points: number): void {
    if (points <= 0) {
      throw new Error('Points to add must be greater than zero');
    }

    const pointsToAdd = Points.create(points);
    this._pointsBalance = this._pointsBalance.add(pointsToAdd);

    // Emitir evento de domínio
    this.addDomainEvent(
      new PointsAddedEvent(
        this._id,
        points,
        collectionId,
        this._pointsBalance.getValue(),
      ),
    );
  }

  redeemPoints(points: number, description: string): void {
    if (points <= 0) {
      throw new Error('Points to redeem must be greater than zero');
    }

    const pointsToRedeem = Points.create(points);

    // Validar se tem pontos suficientes
    if (this._pointsBalance.isLessThan(pointsToRedeem)) {
      throw new Error('Insufficient points balance');
    }

    this._pointsBalance = this._pointsBalance.subtract(pointsToRedeem);

    // Emitir evento de domínio
    this.addDomainEvent(
      new PointsRedeemedEvent(
        this._id,
        points,
        description,
        this._pointsBalance.getValue(),
      ),
    );
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = name;
  }

  updateEmail(email: string): void {
    this._email = new Email(email);
  }

  async updatePassword(newPassword: string): Promise<void> {
    this._password = await Password.create(newPassword);
  }

  assignToEcopoint(ecopointId: string): void {
    if (this._role !== RoleReference.ECOOPERATOR) {
      throw new Error('Only eco-operators can be assigned to ecopoints');
    }
    this._ecopointId = ecopointId;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email.getValue();
  }

  get passwordHash(): string {
    return this._password.getHashedValue();
  }

  get role(): RoleReference {
    return this._role;
  }

  get ecopointId(): string | undefined {
    return this._ecopointId;
  }

  get pointsBalance(): number {
    return this._pointsBalance.getValue();
  }

  isEcoOperator(): boolean {
    return this._role === RoleReference.ECOOPERATOR;
  }

  isRecycler(): boolean {
    return this._role === RoleReference.RECYCLER;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this.email,
      role: this._role,
      ecopointId: this._ecopointId,
      pointsBalance: this.pointsBalance,
    };
  }
}
