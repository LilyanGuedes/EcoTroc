import { Routes } from '@angular/router';
import { roleGuard } from '../guards/role.guard';
import { RoleReference } from '../entities/enums/role-reference.enum';

export const operatorRoutes: Routes = [
  {
    path: 'home',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.ECOOPERATOR] },
    loadComponent: () =>
      import('../modules/eco-operator/home/home-operator.component').then(
        (c) => c.HomeOperatorComponent
      ),
  },
  {
    path: 'declare',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.ECOOPERATOR] },
    loadComponent: () =>
      import('../modules/eco-operator/declare-recycling/declare-recycling.component').then(
        (c) => c.DeclareRecyclingComponent
      ),
  },
  {
    path: 'collections',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.ECOOPERATOR] },
    loadComponent: () =>
      import('../modules/eco-operator/collections/collections.component').then(
        (c) => c.OperatorCollectionsComponent
      ),
  },
  {
    path: 'reports',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.ECOOPERATOR] },
    loadComponent: () =>
      import('../modules/eco-operator/reports/reports.component').then(
        (c) => c.ReportsComponent
      ),
  },
];
