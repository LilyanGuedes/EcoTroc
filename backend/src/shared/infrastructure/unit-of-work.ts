import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DomainEventPublisher } from '../domain/domain-event-publisher';
import { AggregateRoot } from '../domain/aggregate-root.base';

/**
 * Unit of Work pattern para garantir consistência transacional
 * e publicação de eventos após commit bem-sucedido
 */
@Injectable()
export class UnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  /**
   * Executa uma operação dentro de uma transação
   * Publica eventos de domínio somente após commit bem-sucedido
   */
  async execute<T>(
    work: (manager: EntityManager) => Promise<{
      result: T;
      aggregates: AggregateRoot[];
    }>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Executar trabalho dentro da transação
      const { result, aggregates } = await work(queryRunner.manager);

      // Commit da transação
      await queryRunner.commitTransaction();

      // Após commit bem-sucedido, publicar eventos
      const allEvents = aggregates.flatMap((aggregate) =>
        aggregate.getDomainEvents(),
      );

      if (allEvents.length > 0) {
        await this.eventPublisher.publish(allEvents);

        // Limpar eventos dos aggregates
        aggregates.forEach((aggregate) => aggregate.clearDomainEvents());
      }

      return result;
    } catch (error) {
      // Rollback em caso de erro
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar o query runner
      await queryRunner.release();
    }
  }
}
