import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm/user.orm-entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserController } from './interface/controllers/user.controller';
import { RegisterUserUseCase } from './application/use-cases/rigester-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { RedeemPointsUseCase } from './application/use-cases/redeem-points.use-case';
import { DomainEventPublisher } from 'src/shared/domain/domain-event-publisher';
import { UserRegisteredHandler } from './application/event-handlers/user-registered.handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    // Repositories
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    // Use Cases
    RegisterUserUseCase,
    GetUsersUseCase,
    RedeemPointsUseCase,
    // Event Infrastructure
    DomainEventPublisher,
    // Event Handlers
    UserRegisteredHandler,
  ],
  controllers: [UserController],
  exports: [UserRepository, RegisterUserUseCase, 'IUserRepository', DomainEventPublisher],
})
export class UserModule {
  constructor(
    private eventPublisher: DomainEventPublisher,
    private userRegisteredHandler: UserRegisteredHandler,
  ) {
    // Registrar event handlers
    this.eventPublisher.register(
      'UserRegisteredEvent',
      this.userRegisteredHandler,
    );
    this.eventPublisher.register(
      'PointsAddedEvent',
      // Pode criar handler específico se necessário
      {
        handle: async (event: any) => {
          console.log(`[PointsAddedEvent] User ${event.userId} received ${event.points} points`);
        },
      },
    );
    this.eventPublisher.register(
      'PointsRedeemedEvent',
      {
        handle: async (event: any) => {
          console.log(`[PointsRedeemedEvent] User ${event.userId} redeemed ${event.points} points`);
        },
      },
    );
  }
}
