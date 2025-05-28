import { RoleReference } from 'src/shared/domain/role-reference.enum';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: RoleReference,
    public ecopointId?: string,
    public pointsBalance: number = 0,
  ) {}

  addPoints(points: number) {
    this.pointsBalance += points;
  }
}
