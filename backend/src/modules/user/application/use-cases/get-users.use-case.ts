import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    // Por enquanto, retorna todos os usuários
    // Pode adicionar filtros depois (role, ecopointId, etc)
    return await this.userRepository.findAll();
  }
}
