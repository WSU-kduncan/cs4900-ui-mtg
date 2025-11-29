import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cards',
    loadComponent: () =>
      import('./features/card/card-list/card-list.component')
        .then(m => m.CardListComponent),
  },
  { 
    path: 'orders', 
    loadComponent: () =>
      import('./features/order-id/order-id/order-id')
        .then(m => m.OrderIdComponent)
  },
  {
    path: 'workers',
    loadComponent: () =>
      import('./features/worker/worker-id/worker-id')
        .then(m => m.WorkerID),
  },
  { 
    path: '', 
    redirectTo: 'cards', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'cards' 
  },
];