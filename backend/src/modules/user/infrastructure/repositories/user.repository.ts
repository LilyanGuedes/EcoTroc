import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  private toDomain(e: UserOrmEntity): User {
    return User.reconstitute({
      id: e.id,
      name: e.name,
      email: e.email,
      passwordHash: e.password,
      role: e.role,
      ecopointId: e.ecopointId,
      pointsBalance: e.pointsBalance || 0,
    });
  }

  private toOrm(user: User): Partial<UserOrmEntity> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      role: user.role,
      ecopointId: user.ecopointId,
      pointsBalance: user.pointsBalance,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const e = await this.repo.findOneBy({ email });
    return e ? this.toDomain(e) : null;
  }

  async findById(id: string): Promise<User | null> {
    const e = await this.repo.findOneBy({ id });
    return e ? this.toDomain(e) : null;
  }

  async create(user: User): Promise<User> {
    const ormEntity = this.repo.create(this.toOrm(user));
    const saved = await this.repo.save(ormEntity);
    return this.toDomain(saved);
  }

  async save(user: User): Promise<void> {
    await this.repo.save(this.toOrm(user));
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repo.find();
    return entities.map(e => this.toDomain(e));
  }

  async findByRole(role: RoleReference): Promise<User[]> {
    const entities = await this.repo.find({ where: { role } });
    return entities.map(e => this.toDomain(e));
  }
}
