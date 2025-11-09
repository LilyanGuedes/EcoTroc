import { Injectable, Inject } from '@nestjs/common';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';

@Injectable()
export class GetPendingCollectionsUseCase {
  constructor(
    @Inject('ICollectionRepository')
    private collectionRepository: ICollectionRepository,
  ) {}

  async execute(userId: string): Promise<any[]> {
    const collections = await this.collectionRepository.findPendingByUserId(userId);
    return collections.map(c => c.toJSON());
  }
}