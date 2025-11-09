import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { Collection } from '../../domain/entities/collection.entity';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';

export class DeclareRecyclingDto {
  userId: string;
  operatorId: string;
  materialType: string;
  quantity: number;
  description?: string;
}

@Injectable()
export class DeclareRecyclingUseCase {
  constructor(
    @Inject('ICollectionRepository')
    private collectionRepository: ICollectionRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: DeclareRecyclingDto): Promise<{ message: string; collection: any }> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const collection = Collection.create({
      operatorId: dto.operatorId,
      userId: dto.userId,
      materialType: dto.materialType,
      quantity: dto.quantity,
      description: dto.description,
    });

    await this.collectionRepository.create(collection);

    return {
      message: 'Recycling declared successfully. Awaiting user acceptance.',
      collection: collection.toJSON(),
    };
  }
}