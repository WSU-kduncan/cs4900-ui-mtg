import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect root to the workers view by default
  { path: '', pathMatch: 'full', redirectTo: 'workers' },

  // Lazy-load the workers component
  {
    path: 'workers',
    loadComponent: () =>
      import('./features/worker/worker-id/worker-id').then(m => m.WorkerID),
  },

  // Lazy-load the orders component
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/order-id/order-id/order-id').then(m => m.OrderIdComponent),
  },

  // Fallback route
  { path: '**', redirectTo: 'workers' },
];