import { IUserPointsRepository } from '../../domain/repositories/user-points.repository.interface';

export class GetTotalPointsUseCase {
  constructor(private readonly repo: IUserPointsRepository) {}

  async execute(userId: string): Promise<number> {
    const history = await this.repo.findByUserId(userId);
    return history.reduce((sum, p) => sum + p.points, 0);
  }
}
