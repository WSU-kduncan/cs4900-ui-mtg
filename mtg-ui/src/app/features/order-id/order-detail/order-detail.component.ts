import { Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Order } from '../order.service'; 

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="order-detail" [class.paid]="order().status === 'Paid'">
      <div class="header">
        <h3>Order #{{ order().orderId }}</h3>
        <span class="status-badge">{{ order().status }}</span>
      </div>
      
      <p><strong>Date:</strong> {{ order().orderDate | date:'shortDate' }}</p>
      <p><strong>Customer:</strong> {{ order().customerName }}</p>
      <p class="email">{{ order().customerEmail }}</p>
      
      <p><strong>Items:</strong> {{ order().items.length }}</p>
      <p class="total"><strong>Total:</strong> {{ order().totalPrice | currency }}</p>
    </div>
  `,
  styles: [`
    .order-detail {
      border: 1px solid #e2e8f0;
      padding: 1rem;
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .order-detail.paid { border-left: 4px solid #10b981; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    h3 { margin: 0; color: #334155; font-size: 1.1rem; }
    p { margin: 0.25rem 0; color: #64748b; font-size: 0.9rem; }
    .email { font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; }
    .total { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #e2e8f0; color: #0f172a; font-weight: bold; }
    .status-badge { background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; color: #475569; text-transform: uppercase; }
  `]
})
export class OrderDetailComponent {
  order = input.required<Order>();
}