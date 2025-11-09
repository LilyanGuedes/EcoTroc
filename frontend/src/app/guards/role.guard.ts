import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleReference } from '../entities/enums/role-reference.enum';

/**
 * Guard para proteger rotas baseado no role do usuário
 *
 * Uso:
 * { path: 'operator', canActivate: [roleGuard], data: { roles: [RoleReference.ECOOPERATOR] } }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as RoleReference[];

  // Verificar se usuário está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Verificar se tem permissão baseada no role
  if (allowedRoles && userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // Redirecionar para página de acesso negado se não tiver permissão
  router.navigate(['/without-permission']);
  return false;
};
