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
  }
];