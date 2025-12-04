import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrderService, Order, OrderItem } from '../order.service';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-order-id',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderFormComponent, OrderDetailComponent],
  templateUrl: './order-id.html',
  styleUrls: ['./order-id.scss']
})
export class OrderIdComponent {

  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  orderSearch = signal<string>('');
  selectedOrder = signal<Order | null>(null);

  pastedText = '';

  editItemName = signal<string>('');
  editItemPrice = signal<number>(0);

  constructor() {
    this.orderService.getOrders().subscribe({
      next: list => this.orders.set(list),
      error: err => console.error('Error loading orders:', err)
    });
  }

  filteredOrders = computed(() => {
    const search = this.orderSearch().toLowerCase();
    return this.orders().filter(o =>
      o.customerName.toLowerCase().includes(search) ||
      o.customerEmail.toLowerCase().includes(search)
    );
  });

  onOrderCreated() {
    this.orderService.getOrders().subscribe(list => this.orders.set(list));
  }

  selectOrder(orderId?: number) {
    if (!orderId) {
      this.selectedOrder.set(null);
      return;
    }
    const found = this.orders().find(o => o.orderId === orderId) ?? null;
    this.selectedOrder.set(found);
  }

  deleteOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => o.orderId !== id));
      },
      error: err => console.error('Delete failed:', err)
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    const order = this.orders().find(o => o.orderId === orderId);
    if (!order) return;

    this.orderService.updateOrderStatus(order, newStatus).subscribe({
      next: () => {
        this.orders.update(list =>
          list.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)
        );
      },
      error: err => console.error('Update failed:', err)
    });
  }

  appendPastedItems() {
    if (!this.pastedText.trim()) return;

    const newItems = this.pastedText
      .split('\n')
      .map(line => ({ itemName: line.trim(), unitPrice: 0 }));

    const newOrder: Order = {
      orderId: Date.now(),
      customerName: 'Manual Entry',
      customerEmail: 'manual@entry.com',
      employeeId: 1,
      status: 'Pending',
      items: newItems,
      orderDate: new Date(),
      totalPrice: 0
    };

    this.orders.update(list => [...list, newOrder]);
    this.pastedText = '';
  }

  addItemToSelectedOrder() {
    const order = this.selectedOrder();
    if (!order) return;

    const updatedItems: OrderItem[] = [
      ...order.items,
      { itemName: this.editItemName(), unitPrice: Number(this.editItemPrice()) }
    ];

    const updatedOrder = { 
      ...order, 
      items: updatedItems, 
      totalPrice: this.calcTotal(updatedItems) 
    };

    this.orders.update(list =>
      list.map(o => o.orderId === order.orderId ? updatedOrder : o)
    );

    this.selectedOrder.set(updatedOrder);
    this.editItemName.set('');
    this.editItemPrice.set(0);
  }

  removeItemFromSelectedOrder(index: number) {
    const order = this.selectedOrder();
    if (!order) return;

    const updatedItems = order.items.filter((_, i) => i !== index);
    const updatedOrder = { 
      ...order, 
      items: updatedItems, 
      totalPrice: this.calcTotal(updatedItems) 
    };

    this.orders.update(list =>
      list.map(o => o.orderId === order.orderId ? updatedOrder : o)
    );

    this.selectedOrder.set(updatedOrder);
  }

  private calcTotal(items: OrderItem[]): number {
    return items.reduce((s, i) => s + i.unitPrice, 0);
  }
}
