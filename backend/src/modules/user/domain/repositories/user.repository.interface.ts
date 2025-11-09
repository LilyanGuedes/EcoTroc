import { User } from '../entities/user.entity';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByRole(role: RoleReference): Promise<User[]>;
  create(user: User): Promise<User>;
  save(user: User): Promise<void>;
}
