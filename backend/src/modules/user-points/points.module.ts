import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPointsOrmEntity } from './infrastructure/orm/user-points.orm-entity';
import { UserPointsRepository } from './infrastructure/repositories/user-points.repository';
import { PointsController } from './interface/controllers/points.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPointsOrmEntity])],
  providers: [UserPointsRepository],
  controllers: [PointsController],
  exports: [UserPointsRepository],
})
export class PointsModule {}
