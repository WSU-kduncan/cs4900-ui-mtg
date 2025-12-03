import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function authGuard() {
  const router = inject(Router);
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  if (!loggedIn) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
}
