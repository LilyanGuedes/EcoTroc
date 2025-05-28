import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('collections')
export class CollectionOrmEntity {
  @PrimaryColumn('uuid') id: string;
  @Column() operatorId: string;
  @Column() recyclerNickname: string;
  @Column() materialType: string;
  @Column('int') quantity: number;
  @Column('int') points: number;
  @Column({ type: 'timestamp' }) createdAt: Date;
  @Column({ type: 'timestamp', nullable: true }) receivedAt?: Date;
  @Column({ default: false }) received: boolean;
}
