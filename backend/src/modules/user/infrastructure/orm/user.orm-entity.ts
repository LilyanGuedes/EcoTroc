import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column({ type: 'enum', enum: RoleReference }) role: RoleReference;
  @Column({ nullable: true }) ecopointId?: string;
  @Column({ default: 0 }) pointsBalance: number;
}
