import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_points')
export class UserPointsOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') userId: string;
  @Column('uuid') collectionId: string;
  @Column('int') points: number;
  @Column({ type: 'timestamp' }) createdAt: Date;
}
