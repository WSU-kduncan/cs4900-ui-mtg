import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],   // REQUIRED for *ngIf + [(ngModel)]
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }

    // Temporary login logic — replace with real API call later
    if (this.email === 'admin' && this.password === 'admin') {
      // store token ONLY in browser (SSR safe)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', 'valid');
      }
      this.router.navigate(['/orders']);
    } else {
      this.errorMessage = 'Invalid login.';
    }
  }

  error() {
    return this.errorMessage;
  }
}
