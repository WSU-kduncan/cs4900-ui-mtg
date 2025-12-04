import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'cards',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/card/card-list/card-list.component')
        .then(m => m.CardListComponent)
  },

  {
    path: 'workers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/worker/worker-id/worker-id')
        .then(m => m.WorkerID)
  },

  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/order-id/order-id/order-id')
        .then(m => m.OrderIdComponent)
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
