import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionOrmEntity } from './infrastructure/orm/collection.orm-entity';
import { CollectionRepository } from './infrastructure/repositories/collection.repository';
import { CollectionController } from './interface/controllers/collection.controller';
import { PointsModule } from '../user-points/points.module';
import { UserModule } from '../user/user.module';
import { CreateCollectionUseCase } from './application/use-cases/create-collection.use-case';
import { DeclareRecyclingUseCase } from './application/use-cases/declare-recycling.use-case';
import { RespondToCollectionUseCase } from './application/use-cases/respond-to-collection.use-case';
import { GetPendingCollectionsUseCase } from './application/use-cases/get-pending-collections.use-case';
import { CollectionDomainService } from './domain/services/collection.domain-service';
import { DomainEventPublisher } from 'src/shared/domain/domain-event-publisher';
import { CollectionAcceptedHandler } from './application/event-handlers/collection-accepted.handler';
import { CollectionRejectedHandler } from './application/event-handlers/collection-rejected.handler';
import { UnitOfWork } from 'src/shared/infrastructure/unit-of-work';
import { ReportsService } from './application/services/reports.service';
import { GpuModule } from 'src/gpu/gpu.module';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionOrmEntity]), PointsModule, UserModule, GpuModule],
  controllers: [CollectionController],
  providers: [
    // Repositories
    CollectionRepository,
    {
      provide: 'ICollectionRepository',
      useClass: CollectionRepository,
    },
    // Use Cases
    CreateCollectionUseCase,
    DeclareRecyclingUseCase,
    RespondToCollectionUseCase,
    GetPendingCollectionsUseCase,
    // Application Services
    ReportsService,
    // Domain Services
    CollectionDomainService,
    // Event Infrastructure
    DomainEventPublisher,
    UnitOfWork,
    // Event Handlers
    CollectionAcceptedHandler,
    CollectionRejectedHandler,
  ],
  exports: [CreateCollectionUseCase, DomainEventPublisher, UnitOfWork],
})
export class CollectionModule {
  constructor(
    private eventPublisher: DomainEventPublisher,
    private collectionAcceptedHandler: CollectionAcceptedHandler,
    private collectionRejectedHandler: CollectionRejectedHandler,
  ) {
    // Registrar event handlers
    this.eventPublisher.register(
      'CollectionAcceptedEvent',
      this.collectionAcceptedHandler,
    );
    this.eventPublisher.register(
      'CollectionRejectedEvent',
      this.collectionRejectedHandler,
    );
  }
}
