import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = signal('');
  password = signal('');
  error = signal('');

  constructor(private router: Router) {}

  updateUsername(v: string) {
    this.username.set(v);
  }

  updatePassword(v: string) {
    this.password.set(v);
  }

  login() {
    if (this.username() === 'admin' && this.password() === '1234') {
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/cards']);
    } else {
      this.error.set('Invalid username or password.');
    }
  }
}
