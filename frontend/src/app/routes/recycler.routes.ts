import { Routes } from '@angular/router';

export const recyclerRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('../modules/recycler/home-recycler/home-recycler.component').then(
        (c) => c.HomeRecyclerComponent
      ),
  },
];
