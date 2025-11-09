import { Injectable } from '@nestjs/common';
import { DomainEvent } from './domain-event.base';

export interface IDomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

@Injectable()
export class DomainEventPublisher {
  private handlers: Map<string, IDomainEventHandler<any>[]> = new Map();

  register<T extends DomainEvent>(
    eventName: string,
    handler: IDomainEventHandler<T>,
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventName = event.getEventName();
      const handlers = this.handlers.get(eventName) || [];

      for (const handler of handlers) {
        try {
          await handler.handle(event);
        } catch (error) {
          console.error(
            `Error handling event ${eventName}:`,
            error,
          );
          // Não lançar erro para não interromper o fluxo
          // Em produção, enviar para sistema de logging/monitoring
        }
      }
    }
  }
}
