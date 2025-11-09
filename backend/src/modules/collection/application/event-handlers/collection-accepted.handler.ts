import { Injectable, Inject } from '@nestjs/common';
import { IDomainEventHandler } from 'src/shared/domain/domain-event-publisher';
import { CollectionAcceptedEvent } from '../../domain/entities/collection.entity';
import { IUserPointsRepository } from '../../../user-points/domain/repositories/user-points.repository.interface';
import { UserPoints } from '../../../user-points/domain/entities/user-points.entity';

/**
 * Event Handler para CollectionAcceptedEvent
 * Cria um registro de transação de pontos quando uma coleta é aceita
 */
@Injectable()
export class CollectionAcceptedHandler
  implements IDomainEventHandler<CollectionAcceptedEvent>
{
  constructor(
    @Inject('IUserPointsRepository')
    private readonly userPointsRepository: IUserPointsRepository,
  ) {}

  async handle(event: CollectionAcceptedEvent): Promise<void> {
    console.log(
      `[CollectionAcceptedHandler] Processing event for collection ${event.collectionId}`,
    );

    // Criar registro de transação de pontos
    const pointsTransaction = UserPoints.createFromCollection({
      userId: event.userId,
      collectionId: event.collectionId,
      points: event.points,
      description: `Points from accepted collection ${event.collectionId}`,
    });

    await this.userPointsRepository.create(pointsTransaction);

    console.log(
      `[CollectionAcceptedHandler] Points transaction created: ${event.points} points for user ${event.userId}`,
    );
  }
}
