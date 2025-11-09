import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { DomainEventPublisher } from 'src/shared/domain/domain-event-publisher';

export class RedeemPointsDto {
  userId: string;
  points: number;
  description: string;
}

@Injectable()
export class RedeemPointsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(dto: RedeemPointsDto): Promise<{ message: string; remainingPoints: number }> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    if (!user.isRecycler()) {
      throw new BadRequestException('Only recyclers can redeem points');
    }

    if (dto.points <= 0) {
      throw new BadRequestException('Points must be greater than zero');
    }

    // Tentar resgatar pontos (lançará erro se saldo insuficiente)
    try {
      user.redeemPoints(dto.points, dto.description);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    // Persistir usuário
    await this.userRepository.save(user);

    // Publicar eventos
    await this.eventPublisher.publish(user.getDomainEvents());
    user.clearDomainEvents();

    return {
      message: `${dto.points} pontos resgatados com sucesso!`,
      remainingPoints: user.pointsBalance,
    };
  }
}
