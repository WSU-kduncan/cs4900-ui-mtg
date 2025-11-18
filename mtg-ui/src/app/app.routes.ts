import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'workers',
        loadComponent: () =>
            import('./features/worker/worker-id/worker-id')
                .then(m => m.WorkerID),
    },
    { path: '', pathMatch: 'full', redirectTo: 'workers' },
    { path: '**', redirectTo: 'workers' },
];
