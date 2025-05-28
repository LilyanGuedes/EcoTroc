import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOneBy({ email });
    if (!entity) return null;
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.role,
      entity.ecopointId,
    );
  }

  async create(user: User): Promise<User> {
    const entity = this.ormRepo.create(user);
    const saved = await this.ormRepo.save(entity);
    return new User(
      saved.id,
      saved.name,
      saved.email,
      saved.password,
      saved.role,
      saved.ecopointId,
    );
  }
}
