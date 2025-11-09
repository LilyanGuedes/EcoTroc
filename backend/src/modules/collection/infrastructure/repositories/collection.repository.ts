import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CollectionOrmEntity } from '../orm/collection.orm-entity';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { Collection, CollectionStatus } from '../../domain/entities/collection.entity';

@Injectable()
export class CollectionRepository implements ICollectionRepository {
  constructor(
    @InjectRepository(CollectionOrmEntity)
    private readonly repo: Repository<CollectionOrmEntity>,
  ) {}

  private toDomain(e: CollectionOrmEntity): Collection {
    return Collection.reconstitute({
      id: e.id,
      operatorId: e.operatorId,
      userId: e.userId,
      materialType: e.materialType,
      quantity: e.quantity,
      points: e.points,
      createdAt: e.createdAt,
      status: e.status as CollectionStatus,
      respondedAt: e.respondedAt,
      description: e.description,
    });
  }

  private toOrm(collection: Collection): Partial<CollectionOrmEntity> {
    return {
      id: collection.id,
      operatorId: collection.operatorId,
      userId: collection.userId,
      materialType: collection.materialType,
      quantity: collection.quantity,
      points: collection.points,
      createdAt: collection.createdAt,
      status: collection.status,
      respondedAt: collection.respondedAt,
      description: collection.description,
    };
  }

  async create(collection: Collection, manager?: EntityManager): Promise<void> {
    const data = this.toOrm(collection);
    if (manager) {
      await manager.insert(CollectionOrmEntity, data);
    } else {
      await this.repo.insert(data);
    }
  }

  async findById(id: string): Promise<Collection | null> {
    const e = await this.repo.findOneBy({ id });
    return e ? this.toDomain(e) : null;
  }

  async save(collection: Collection): Promise<void> {
    await this.repo.save(this.toOrm(collection));
  }

  async findByUserId(userId: string): Promise<Collection[]> {
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findPendingByUserId(userId: string): Promise<Collection[]> {
    const entities = await this.repo.find({
      where: { userId, status: CollectionStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findAll(): Promise<Collection[]> {
    const entities = await this.repo.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }
}
