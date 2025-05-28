import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

export class RegisterUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new Error('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new User(
      uuid(),
      dto.name,
      new Email(dto.email).getValue(),
      hashed,
      dto.role,
      dto.ecopointId,
    );
    return this.repo.create(user);
  }
}
