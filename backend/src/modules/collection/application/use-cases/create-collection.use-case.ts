import { CreateCollectionDto } from '../dto/create-collection.dto';
import { Collection } from '../../domain/entities/collection.entity';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { v4 as uuidv4 } from 'uuid';

export class CreateCollectionUseCase {
  constructor(
    private readonly collectionRepo: ICollectionRepository,
    private readonly userPointsRepo: any, // will be injected from PointsModule
  ) {}

  async execute(dto: CreateCollectionDto): Promise<void> {
    const points = this.calculatePoints(dto.materialType, dto.quantity);
    const id = uuidv4();
    const collection = new Collection(
      id,
      dto.operatorId,
      dto.recyclerNickname,
      dto.materialType,
      dto.quantity,
      points,
      new Date(),
    );
    await this.collectionRepo.create(collection);

    // Delegates to PointsModule
    await this.userPointsRepo.create({
      id: uuidv4(),
      userId: dto.recyclerNickname,
      collectionId: id,
      points,
      createdAt: new Date(),
    });
  }

  private calculatePoints(material: string, qty: number): number {
    const base: Record<string, number> = {
      PLASTICO: 10,
      PAPEL: 5,
      VIDRO: 8,
      METAL: 12,
    };
    return (base[material.toUpperCase()] || 1) * qty;
  }
}
