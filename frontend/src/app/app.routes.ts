import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/start/start.component').then((c) => c.StartComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register-user',
    loadComponent: () =>
      import('./modules/auth/register-user/register-user.component').then(
        (c) => c.RegisterUserComponent
      ),
  },
  {
    path: 'recycler',
    loadChildren: () =>
      import('../app/routes/recycler.routes').then((m) => m.recyclerRoutes),
  },
  {
    path: 'operator',
    loadChildren: () =>
      import('../app/routes/operator.routes').then((m) => m.operatorRoutes),
  },
];
