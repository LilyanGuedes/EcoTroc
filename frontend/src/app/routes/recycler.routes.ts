import { Routes } from '@angular/router';
import { roleGuard } from '../guards/role.guard';
import { RoleReference } from '../entities/enums/role-reference.enum';

export const recyclerRoutes: Routes = [
  {
    path: 'home',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.RECYCLER] },
    loadComponent: () =>
      import('../modules/recycler/home-recycler/home-recycler.component').then(
        (c) => c.HomeRecyclerComponent
      ),
  },
  {
    path: 'points',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.RECYCLER] },
    loadComponent: () =>
      import('../modules/recycler/points/points.component').then(
        (c) => c.PointsComponent
      ),
  },
  {
    path: 'redeem',
    canActivate: [roleGuard],
    data: { roles: [RoleReference.RECYCLER] },
    loadComponent: () =>
      import('../modules/recycler/redeem-points/redeem-points.component').then(
        (c) => c.RedeemPointsComponent
      ),
  },
];
