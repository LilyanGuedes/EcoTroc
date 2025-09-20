import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CollectionOrmEntity } from '../orm/collection.orm-entity';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { Collection } from '../../domain/entities/collection.entity';

@Injectable()
export class CollectionRepository implements ICollectionRepository {
  constructor(
    @InjectRepository(CollectionOrmEntity)
    private readonly repo: Repository<CollectionOrmEntity>,
  ) {}

  async create(collection: Collection, manager?: EntityManager): Promise<void> {
    const data = { ...collection };
    if (manager) {
      await manager.insert(CollectionOrmEntity, data);
    } else {
      await this.repo.insert({ ...collection });
    }
  }

  async findById(id: string): Promise<Collection | null> {
    const e = await this.repo.findOneBy({ id });
    if (!e) return null;
    return new Collection(
      e.id,
      e.operatorId,
      e.recyclerNickname,
      e.materialType,
      e.quantity,
      e.points,
      e.createdAt,
      e.receivedAt,
      e.received,
    );
  }
}
