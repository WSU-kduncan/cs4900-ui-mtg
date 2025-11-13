import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Order = {
  orderID: number;
  orderStatusTypeID: number;
  statusDescription: string;
  customerEmail: string;
  employeeEmail?: string;
  orderDate: string; 
};

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrdersComponent {
  readonly loading = signal(false);
  readonly query = signal('');

  readonly newOrderCustomer = signal('');
  readonly newOrderEmployee = signal('');
  readonly newOrderStatus   = signal('');

  readonly detailId = signal<number | null>(null); 
  readonly PRICE_PER_CARD = 2.5; 

  readonly orders = signal<Order[]>([
    { orderID: 5001, orderStatusTypeID: 1, statusDescription: 'Pending',   customerEmail: 'sara@mtgshop.com', employeeEmail: 'noah.stone@mtgshop.com', orderDate: '2025-10-01T10:00:00' },
    { orderID: 5002, orderStatusTypeID: 2, statusDescription: 'Paid',      customerEmail: 'mike@mtgshop.com', employeeEmail: 'lia.park@mtgshop.com',   orderDate: '2025-10-02T12:30:00' },
    { orderID: 5003, orderStatusTypeID: 3, statusDescription: 'Fulfilled', customerEmail: 'josh@mtgshop.com', employeeEmail: 'ava.reed@mtgshop.com',   orderDate: '2025-10-03T15:45:00' },
  ]);

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

  dummyCardCount(id: number): number {
    return ((id * 7) % 20) + 1;
  }

  addOrder(): void {
    const customer = this.newOrderCustomer().trim();
    const employee = this.newOrderEmployee().trim();
    const status   = this.newOrderStatus().trim();
    if (!customer || !status) return;

    const maxId = Math.max(...this.orders().map(o => o.orderID), 5000);
    const newOrder: Order = {
      orderID: maxId + 1,
      orderStatusTypeID: 0,
      statusDescription: status,
      customerEmail: customer,
      employeeEmail: employee || undefined,
      orderDate: new Date().toISOString(),
    };

    this.orders.update(list => [newOrder, ...list]);
    this.newOrderCustomer.set('');
    this.newOrderEmployee.set('');
    this.newOrderStatus.set('');
  }

  load(): void {
    this.loading.set(false);
  }

  toggleDetail(id: number): void {
    this.detailId.update(cur => (cur === id ? null : id));
  }
}