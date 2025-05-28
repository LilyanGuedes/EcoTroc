import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPointsOrmEntity } from '../orm/user-points.orm-entity';
import { IUserPointsRepository } from '../../domain/repositories/user-points.repository.interface';
import { UserPoints } from '../../domain/entities/user-points.entity';

@Injectable()
export class UserPointsRepository implements IUserPointsRepository {
  constructor(
    @InjectRepository(UserPointsOrmEntity)
    private readonly repo: Repository<UserPointsOrmEntity>,
  ) {}

  async create(points: UserPoints): Promise<void> {
    const orm = this.repo.create(points);
    await this.repo.save(orm);
  }

  async findByUserId(userId: string): Promise<UserPoints[]> {
    const list = await this.repo.find({ where: { userId } });
    return list.map(
      (e) =>
        new UserPoints(e.id, e.userId, e.collectionId, e.points, e.createdAt),
    );
  }
}
