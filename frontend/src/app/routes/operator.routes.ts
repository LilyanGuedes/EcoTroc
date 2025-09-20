import { Routes } from '@angular/router';

export const operatorRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('../modules/eco-operator/home/home-operator.component').then(
        (c) => c.HomeOperatorComponent
      ),
  },
];
