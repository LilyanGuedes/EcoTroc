import { Injectable } from '@nestjs/common';
import { IDomainEventHandler } from 'src/shared/domain/domain-event-publisher';
import { CollectionRejectedEvent } from '../../domain/entities/collection.entity';

/**
 * Event Handler para CollectionRejectedEvent
 * Processa eventos de rejeição de coleta (logging, notificações, etc)
 */
@Injectable()
export class CollectionRejectedHandler
  implements IDomainEventHandler<CollectionRejectedEvent>
{
  async handle(event: CollectionRejectedEvent): Promise<void> {
    console.log(
      `[CollectionRejectedHandler] Collection ${event.collectionId} rejected by user ${event.userId}`,
    );

    if (event.reason) {
      console.log(`[CollectionRejectedHandler] Reason: ${event.reason}`);
    }

    // Aqui você pode adicionar:
    // - Envio de notificação para o operador
    // - Registro em sistema de auditoria
    // - Atualização de estatísticas
    // - etc.
  }
}
