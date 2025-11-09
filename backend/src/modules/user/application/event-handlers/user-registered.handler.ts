import { Injectable } from '@nestjs/common';
import { IDomainEventHandler } from 'src/shared/domain/domain-event-publisher';
import { UserRegisteredEvent } from '../../domain/entities/user.entity';

/**
 * Event Handler para UserRegisteredEvent
 * Processa ações após registro de usuário
 */
@Injectable()
export class UserRegisteredHandler
  implements IDomainEventHandler<UserRegisteredEvent>
{
  async handle(event: UserRegisteredEvent): Promise<void> {
    console.log(
      `[UserRegisteredHandler] New user registered: ${event.email} (${event.role})`,
    );

    // Aqui você pode adicionar:
    // - Envio de email de boas-vindas
    // - Criação de registros relacionados
    // - Notificação para admins
    // - etc.
  }
}
