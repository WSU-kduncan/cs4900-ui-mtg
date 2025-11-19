import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'orders',
        loadComponent: () =>
            import('./features/order/orders/orders.component')
                .then(m => m.OrdersComponent),
    },
    { path: '', pathMatch: 'full', redirectTo: 'orders' },
    { path: '**', redirectTo: 'orders' },
];