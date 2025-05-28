import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const user = new User(
      uuidv4(),
      dto.name,
      dto.email,
      dto.password, // Você pode aplicar hash aqui
      dto.role,
      dto.role === RoleReference.ECOOPERATOR ? dto.ecopointId : undefined,
    );

    return this.userRepository.create(user);
  }
}
