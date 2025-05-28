import { Controller, Post, Body } from '@nestjs/common';
import { CreateCollectionDto } from '../../application/dto/create-collection.dto';
import { CollectionRepository } from '../../infrastructure/repositories/collection.repository';
import { CreateCollectionUseCase } from '../../application/use-cases/create-collection.use-case';
import { UserPointsRepository } from 'src/modules/user-points/infrastructure/repositories/user-points.repository';

@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionRepo: CollectionRepository,
    private readonly userPointsRepo: UserPointsRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreateCollectionDto): Promise<void> {
    const uc = new CreateCollectionUseCase(
      this.collectionRepo,
      this.userPointsRepo,
    );
    await uc.execute(dto);
  }
}
