import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';


import { OrderService, Order, Card } from './order.service';

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrdersComponent {
  // 1. Inject the Service (requires provideHttpClient in app.config.ts)
  private orderService = inject(OrderService);

  loading = signal(false);
  query = signal('');

  // Form Signals
  newOrderCustomer = signal('');
  newOrderEmployee = signal('');
  newOrderStatus = signal('');
  newCardName = signal('');
  newCardCount = signal(1);
  newCardPrice = signal(2.5);
  
  
  cards = signal<Card[]>([]); 
  
  detailId = signal<number | null>(null);

  
  orders = toSignal(this.orderService.getOrders(), { initialValue: [] });


  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.orders(); 
    
    if (!q) return list;
    return list.filter(
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

   
    const newOrderPayload = {
      orderStatusTypeID: 0, 
      statusDescription: status,
      customerEmail: customer,
      employeeEmail: employee || undefined,
      cards: [...cards],
    };

    console.log('Submitting new order to API:', newOrderPayload);

   

  
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
    console.log(`Update Status: Order #${order.orderID} -> ${newStatus}`);
  
  }
}