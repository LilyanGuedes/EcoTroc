import { SetMetadata } from '@nestjs/common';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleReference[]) =>
  SetMetadata(ROLES_KEY, roles);
