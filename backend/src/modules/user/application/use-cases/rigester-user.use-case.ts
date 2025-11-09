import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import { User } from '../../domain/entities/user.entity';
import { DomainEventPublisher } from 'src/shared/domain/domain-event-publisher';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new Error('Email already in use');
    }

    // Entidade User agora encapsula a criação e hash da senha
    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      ecopointId: dto.ecopointId,
    });

    // Persistir o Aggregate
    const savedUser = await this.repo.create(user);

    // Publicar eventos de domínio
    await this.eventPublisher.publish(user.getDomainEvents());
    user.clearDomainEvents();

    return savedUser;
  }
}
