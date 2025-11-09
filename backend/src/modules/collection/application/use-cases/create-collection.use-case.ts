import { Injectable, Inject } from '@nestjs/common';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { Collection } from '../../domain/entities/collection.entity';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { IUserPointsRepository } from 'src/modules/user-points/domain/repositories/user-points.repository.interface';
import { UserPoints } from 'src/modules/user-points/domain/entities/user-points.entity';

@Injectable()
export class CreateCollectionUseCase {
  constructor(
    @Inject('ICollectionRepository')
    private readonly collectionRepo: ICollectionRepository,
    @Inject('IUserPointsRepository')
    private readonly userPointsRepo: IUserPointsRepository,
  ) {}

  async execute(dto: CreateCollectionDto): Promise<void> {
    // Entidade Collection agora calcula seus próprios pontos
    const collection = Collection.create({
      operatorId: dto.operatorId,
      userId: dto.userId || dto.recyclerNickname || '',
      materialType: dto.materialType,
      quantity: dto.quantity,
    });

    await this.collectionRepo.create(collection);

    // Criar transação de pontos
    const pointsTransaction = UserPoints.createFromCollection({
      userId: dto.userId || dto.recyclerNickname || '',
      collectionId: collection.id,
      points: collection.points,
    });

    await this.userPointsRepo.create(pointsTransaction);
  }
}
