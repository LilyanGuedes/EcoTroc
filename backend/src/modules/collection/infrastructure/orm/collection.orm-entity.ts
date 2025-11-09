import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('collections')
export class CollectionOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() operatorId: string;
  @Column() userId: string;
  @Column() materialType: string;
  @Column('int') quantity: number;
  @Column('int') points: number;
  @Column({ type: 'timestamp' }) createdAt: Date;
  @Column({ type: 'timestamp', nullable: true }) respondedAt?: Date;
  @Column({
    type: 'varchar',
    default: 'pending'
  }) status: string;
  @Column({ nullable: true }) description?: string;
}