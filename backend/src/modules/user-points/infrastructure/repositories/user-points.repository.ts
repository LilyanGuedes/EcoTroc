import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPointsOrmEntity } from '../orm/user-points.orm-entity';
import { IUserPointsRepository } from '../../domain/repositories/user-points.repository.interface';
import { UserPoints, TransactionType } from '../../domain/entities/user-points.entity';

@Injectable()
export class UserPointsRepository implements IUserPointsRepository {
  constructor(
    @InjectRepository(UserPointsOrmEntity)
    private readonly repo: Repository<UserPointsOrmEntity>,
  ) {}

  private toDomain(e: UserPointsOrmEntity): UserPoints {
    return UserPoints.reconstitute({
      id: e.id,
      userId: e.userId,
      collectionId: e.collectionId,
      points: e.points,
      transactionType: e.transactionType as TransactionType,
      description: e.description,
      createdAt: e.createdAt,
    });
  }

  private toOrm(userPoints: UserPoints): Partial<UserPointsOrmEntity> {
    return {
      id: userPoints.id,
      userId: userPoints.userId,
      collectionId: userPoints.collectionId,
      points: userPoints.points,
      transactionType: userPoints.transactionType,
      description: userPoints.description,
      createdAt: userPoints.createdAt,
    };
  }

  async create(points: UserPoints): Promise<void> {
    const orm = this.repo.create(this.toOrm(points));
    await this.repo.save(orm);
  }

  async findByUserId(userId: string): Promise<UserPoints[]> {
    const list = await this.repo.find({ where: { userId } });
    return list.map((e) => this.toDomain(e));
  }

  async getTotalPointsByUserId(userId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('up')
      .select('SUM(up.points)', 'total')
      .where('up.userId = :userId', { userId })
      .getRawOne();

    return result?.total || 0;
  }
}
