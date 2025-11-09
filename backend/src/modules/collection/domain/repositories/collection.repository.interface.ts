import { Collection } from '../entities/collection.entity';

export interface ICollectionRepository {
  create(collection: Collection): Promise<void>;
  findById(id: string): Promise<Collection | null>;
  save(collection: Collection): Promise<void>;
  findByUserId(userId: string): Promise<Collection[]>;
  findPendingByUserId(userId: string): Promise<Collection[]>;
  findAll(): Promise<Collection[]>;
}
