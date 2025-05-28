import { UserPoints } from '../entities/user-points.entity';

export interface IUserPointsRepository {
  create(points: UserPoints): Promise<void>;
  findByUserId(userId: string): Promise<UserPoints[]>;
}
