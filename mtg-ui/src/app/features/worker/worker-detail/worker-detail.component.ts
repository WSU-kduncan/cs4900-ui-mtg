import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Worker } from '../worker.service';

@Component({
  selector: 'app-worker-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="worker-detail">
      <h3>{{ worker().firstName }} {{ worker().lastName }}</h3>
      <p><strong>Employee ID:</strong> {{ worker().employeeID }}</p>
      <p><strong>Email:</strong> {{ worker().email }}</p>
      <p><strong>Role:</strong> {{ worker().role }}</p>
    </div>
  `,
  styles: [`
    .worker-detail {
      border: 1px solid #ddd;
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    p {
      margin: 0.25rem 0;
      color: #666;
    }
  `]
})
export class WorkerDetailComponent {
  worker = input.required<Worker>();
}
