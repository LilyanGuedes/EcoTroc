import { RoleReference } from 'src/shared/domain/role-reference.enum';
export class RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role: RoleReference;
  ecopointId?: string;
}
