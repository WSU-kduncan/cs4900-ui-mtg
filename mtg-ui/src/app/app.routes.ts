import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cards',
    loadComponent: () =>
      import('./features/card/card-list/card-list.component')
        .then(m => m.CardListComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'cards' },
  { path: '**', redirectTo: 'cards' },
];
