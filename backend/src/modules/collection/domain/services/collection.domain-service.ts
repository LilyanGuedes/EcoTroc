import { Injectable } from '@nestjs/common';
import { Collection } from '../entities/collection.entity';
import { User } from '../../../user/domain/entities/user.entity';

/**
 * Domain Service para coordenar operações entre múltiplos Aggregates
 * Este serviço contém lógica de domínio que não pertence a nenhum Aggregate específico
 */
@Injectable()
export class CollectionDomainService {
  /**
   * Processa a resposta do usuário a uma coleta
   * Coordena os Aggregates Collection e User mantendo a consistência
   */
  processCollectionResponse(
    collection: Collection,
    user: User,
    accept: boolean,
    reason?: string,
  ): void {
    // Validação de domínio: usuário deve ser o dono da coleta (reciclador)
    if (!user.isRecycler()) {
      throw new Error('Only recyclers can respond to collections');
    }

    // Validar que o usuário é o dono da coleta
    if (collection.userId !== user.id) {
      throw new Error('You can only respond to your own collections');
    }

    if (accept) {
      // Aceitar a coleta (emite CollectionAcceptedEvent)
      collection.acceptBy(user.id);

      // Adicionar pontos ao usuário (emite PointsAddedEvent)
      user.addPointsFromCollection(collection.id, collection.points);
    } else {
      // Rejeitar a coleta (emite CollectionRejectedEvent)
      collection.rejectBy(user.id, reason);
    }
  }

  /**
   * Valida se um operador pode declarar uma reciclagem
   */
  validateRecyclingDeclaration(operator: User, recycler: User): void {
    if (!operator.isEcoOperator()) {
      throw new Error('Only eco-operators can declare recycling');
    }

    if (!recycler.isRecycler()) {
      throw new Error('Recycling can only be declared for recyclers');
    }
  }
}
