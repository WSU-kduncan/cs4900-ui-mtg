import { Routes } from '@angular/router';
// Adjust this import path to match where your file actually is
import { OrderIdComponent } from './features/order-id/order-id/order-id';

export const routes: Routes = [
  // 1. Default Path: Load the Order Dashboard immediately
  { 
    path: '', 
    component: OrderIdComponent 
  },

  // 2. Wildcard: If the user types a wrong URL, go back to Dashboard
  { 
    path: '**', 
    redirectTo: '' 
  }
];