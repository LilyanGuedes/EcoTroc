import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_points')
export class UserPointsOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('varchar') userId: string;
  @Column({ type: 'uuid', nullable: true }) collectionId: string | null;
  @Column('int') points: number;
  @Column('varchar') transactionType: string;
  @Column('text') description: string;
  @Column({ type: 'timestamp' }) createdAt: Date;
}
