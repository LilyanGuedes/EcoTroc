import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import { CollectionDomainService } from '../../domain/services/collection.domain-service';
import { UnitOfWork } from 'src/shared/infrastructure/unit-of-work';
import { EntityManager } from 'typeorm';
import { CollectionOrmEntity } from '../../infrastructure/orm/collection.orm-entity';
import { UserOrmEntity } from '../../../user/infrastructure/orm/user.orm-entity';

export class RespondToCollectionDto {
  collectionId: string;
  userId: string;
  accept: boolean;
  reason?: string;
}

/**
 * Use Case refatorado seguindo DDD com Unit of Work:
 * - Usa Domain Service para coordenar Aggregates
 * - Unit of Work garante consistência transacional
 * - Eventos publicados apenas após commit bem-sucedido
 * - Mantém apenas orquestração na camada de aplicação
 */
@Injectable()
export class RespondToCollectionUseCase {
  constructor(
    @Inject('ICollectionRepository')
    private collectionRepository: ICollectionRepository,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    private collectionDomainService: CollectionDomainService,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute(dto: RespondToCollectionDto): Promise<{ message: string; collection: any }> {
    // Executar dentro de uma transação usando Unit of Work
    const result = await this.unitOfWork.execute(async (manager: EntityManager) => {
      // 1. Buscar Aggregates
      const collection = await this.collectionRepository.findById(dto.collectionId);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${dto.collectionId} not found`);
      }

      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }

      // 2. Executar lógica de domínio via Domain Service
      // Isso coordena os dois Aggregates e emite eventos
      try {
        this.collectionDomainService.processCollectionResponse(
          collection,
          user,
          dto.accept,
          dto.reason,
        );
      } catch (error) {
        throw new BadRequestException(error.message);
      }

      // 3. Persistir Aggregates dentro da transação
      const collectionOrm = manager.getRepository(CollectionOrmEntity);
      const userOrm = manager.getRepository(UserOrmEntity);

      await collectionOrm.save({
        id: collection.id,
        operatorId: collection.operatorId,
        userId: collection.userId,
        materialType: collection.materialType,
        quantity: collection.quantity,
        points: collection.points,
        status: collection.status,
        respondedAt: collection.respondedAt,
        description: collection.description,
        createdAt: collection.createdAt,
      });

      await userOrm.save({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
        ecopointId: user.ecopointId,
        pointsBalance: user.pointsBalance,
      });

      // 4. Retornar resultado e aggregates para publicação de eventos
      return {
        result: {
          message: dto.accept
            ? `Collection accepted! ${collection.points} points added to your account.`
            : 'Collection rejected.',
          collection: collection.toJSON(),
        },
        aggregates: [collection, user],
      };
    });

    return result;
  }
}