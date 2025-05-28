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
    return new User(
      e.id,
      e.name,
      e.email,
      e.password,
      e.role,
      e.ecopointId,
      e.pointsBalance,
    );
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
    const e = this.repo.create({ ...user });
    const saved = await this.repo.save(e);
    return this.toDomain(saved);
  }

  async save(user: User): Promise<void> {
    await this.repo.save({ ...user });
  }
}
