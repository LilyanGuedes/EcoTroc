import { Controller, Get, Param } from '@nestjs/common';
import { UserPointsRepository } from '../../infrastructure/repositories/user-points.repository';
import { GetTotalPointsUseCase } from '../../application/use-cases/get-total-points.use-case';

@Controller('points')
export class PointsController {
  constructor(private readonly userPointsRepo: UserPointsRepository) {}

  @Get('total/:userId')
  async total(@Param('userId') userId: string) {
    const uc = new GetTotalPointsUseCase(this.userPointsRepo);
    const total = await uc.execute(userId);
    return { userId, total };
  }

  @Get('history/:userId')
  async history(@Param('userId') userId: string) {
    return await this.userPointsRepo.findByUserId(userId);
  }
}
