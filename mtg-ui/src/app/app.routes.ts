import { Routes } from '@angular/router';

import { OrderIdComponent } from './features/order-id/order-id/order-id'; 

export const routes: Routes = [

  { 
    path: '', 
    component: OrderIdComponent 
  },

  { 
    path: '**', 
    redirectTo: '' 
  },
  {
        path: 'workers',
        loadComponent: () =>
            import('./features/worker/worker-id/worker-id')
                .then(m => m.WorkerID),
    },
    { path: '', pathMatch: 'full', redirectTo: 'workers' },
    { path: '**', redirectTo: 'workers' },
];