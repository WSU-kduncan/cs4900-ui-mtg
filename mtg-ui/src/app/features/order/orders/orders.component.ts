import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Order = {
  orderID: number;
  orderStatusTypeID: number;
  statusDescription: string;
  customerEmail: string;
  employeeEmail?: string;
  orderDate: string;          // ISO date string
};

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  readonly loading = signal(false);
  readonly query = signal('');

  /* ----------  dummy data – replace with HTTP call later ---------- */
  readonly orders = signal<Order[]>([
    {
      orderID: 5001,
      orderStatusTypeID: 1,
      statusDescription: 'Pending',
      customerEmail: 'sara@mtgshop.com',
      employeeEmail: 'noah.stone@mtgshop.com',
      orderDate: '2025-10-01T10:00:00'
    },
    {
      orderID: 5002,
      orderStatusTypeID: 2,
      statusDescription: 'Paid',
      customerEmail: 'mike@mtgshop.com',
      employeeEmail: 'lia.park@mtgshop.com',
      orderDate: '2025-10-02T12:30:00'
    },
    {
      orderID: 5003,
      orderStatusTypeID: 3,
      statusDescription: 'Fulfilled',
      customerEmail: 'josh@mtgshop.com',
      employeeEmail: 'ava.reed@mtgshop.com',
      orderDate: '2025-10-03T15:45:00'
    }
  ]);

  /* ----------  client-side filter ---------- */
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.orders();
    return this.orders().filter(o =>
      o.orderID.toString().includes(q) ||
      o.statusDescription.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.employeeEmail?.toLowerCase().includes(q)
    );
  });

  load() {
    // future HTTP call will go here
    this.loading.set(false);
  }

  onSearch() {
    // reactive filter – nothing else to do
  }

  trackByKey = (_: number, o: Order) => o.orderID;
}