import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionOrmEntity } from './infrastructure/orm/collection.orm-entity';
import { CollectionRepository } from './infrastructure/repositories/collection.repository';
import { CollectionController } from './interface/controllers/collection.controller';
import { PointsModule } from '../user-points/points.module';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionOrmEntity]), PointsModule],
  controllers: [CollectionController],
  providers: [CollectionRepository],
})
export class CollectionModule {}
