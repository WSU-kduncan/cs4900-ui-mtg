import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Card = { name: string; count: number; price: number };
type Order = {
  orderID: number;
  orderStatusTypeID: number;
  statusDescription: string;
  customerEmail: string;
  employeeEmail?: string;
  orderDate: string;
  cards: Card[];
};

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrdersComponent {
  loading = signal(false);
  query = signal('');

  newOrderCustomer = signal('');
  newOrderEmployee = signal('');
  newOrderStatus = signal('');
  newCardName = signal('');
  newCardCount = signal(1);
  newCardPrice = signal(2.5);
  cards = signal<Card[]>([]);
  detailId = signal<number | null>(null);

  orders = signal<Order[]>([
    {
      orderID: 5001,
      orderStatusTypeID: 1,
      statusDescription: 'Pending',
      customerEmail: 'sara@mtgshop.com',
      employeeEmail: 'noah.stone@mtgshop.com',
      orderDate: '2025-10-01T10:00:00',
      cards: [{ name: 'Lightning Bolt', count: 4, price: 2.5 }],
    },
    {
      orderID: 5002,
      orderStatusTypeID: 2,
      statusDescription: 'Paid',
      customerEmail: 'mike@mtgshop.com',
      employeeEmail: 'lia.park@mtgshop.com',
      orderDate: '2025-10-02T12:30:00',
      cards: [{ name: 'Sol Ring', count: 1, price: 15 }],
    },
  ]);

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.orders();
    return this.orders().filter(
      (o) =>
        o.orderID.toString().includes(q) ||
        o.statusDescription.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.employeeEmail?.toLowerCase().includes(q)
    );
  });

  statusOptions: string[] = ['Pending', 'Paid', 'Fulfilled', 'Cancelled'];

  addCard(): void {
    const name = this.newCardName().trim();
    const count = this.newCardCount();
    const price = this.newCardPrice();
    if (!name || count <= 0 || price <= 0) return;
    this.cards.update((list) => [...list, { name, count, price }]);
    this.newCardName.set('');
    this.newCardCount.set(1);
    this.newCardPrice.set(2.5);
  }

  removeCard(index: number): void {
    this.cards.update((list) => list.filter((_, i) => i !== index));
  }

  addOrder(): void {
    const customer = this.newOrderCustomer().trim();
    const employee = this.newOrderEmployee().trim();
    const status = this.newOrderStatus().trim();
    const cards = this.cards();
    if (!customer || !status || cards.length === 0) return;

    const maxId = Math.max(...this.orders().map((o) => o.orderID), 5000);
    const newOrder: Order = {
      orderID: maxId + 1,
      orderStatusTypeID: 0,
      statusDescription: status,
      customerEmail: customer,
      employeeEmail: employee || undefined,
      orderDate: new Date().toISOString(),
      cards: [...cards],
    };

    this.orders.update((list) => [newOrder, ...list]);
    this.newOrderCustomer.set('');
    this.newOrderEmployee.set('');
    this.newOrderStatus.set('');
    this.cards.set([]);
  }

  load(): void {
    this.loading.set(false);
  }

  toggleDetail(id: number): void {
    this.detailId.update((cur) => (cur === id ? null : id));
  }

  totalCost(cards: Card[]): number {
    return cards.reduce((sum, c) => sum + c.count * c.price, 0);
  }

  changeStatus(order: Order, newStatus: string): void {
    this.orders.update((list) =>
      list.map((o) =>
        o.orderID === order.orderID
          ? { ...o, statusDescription: newStatus }
          : o
      )
    );
  }
}