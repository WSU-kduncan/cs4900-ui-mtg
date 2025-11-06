import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',   pathMatch: 'full', redirectTo: 'orders' },
  { path: 'orders', loadComponent: () => import('/home/ethanwoe/cs4900-ui-mtg/mtg-ui/src/app/features/order/orders/orders.component').then(m => m.OrdersComponent) },
  { path: '**', redirectTo: 'orders' }
];