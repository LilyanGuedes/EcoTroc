import { Collection } from '../entities/collection.entity';

export interface ICollectionRepository {
  create(collection: Collection): Promise<void>;
  findById(id: string): Promise<Collection | null>;
}
