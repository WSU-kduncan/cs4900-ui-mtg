import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop'; 
import { OrderService, Order, OrderItem } from '../order.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderForm } from '../order-form/order-form';

@Component({
  selector: 'app-order-id',
  standalone: true,
  imports: [CommonModule, OrderDetailComponent, OrderForm],
  templateUrl: './order-id.html',
  styleUrls: ['./order-id.scss']
})
export class OrderIdComponent {
  private orderService = inject(OrderService);
  
  private ordersData = signal<Order[]>([]);
  apiOrders = this.ordersData.asReadonly();

  selectedOrderId = signal<number | null>(null);
  orderSearch = signal('');
  editItemName = signal('');
  editItemPrice = signal('');

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => this.ordersData.set(orders),
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  selectOrder(id?: number) {
    this.selectedOrderId.set(id ?? null);
    this.editItemName.set('');
    this.editItemPrice.set('');
  }

  updateStatus(id: number, newStatus: string) {
    const order = this.apiOrders().find(o => o.orderId === id);
    if (!order) return;
    
    this.orderService.updateOrderStatus(order, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }

  addItemToSelectedOrder() {
    const id = this.selectedOrderId();
    const name = this.editItemName();
    const price = parseFloat(this.editItemPrice());

    if (id && name && !isNaN(price)) {
      this.orderService.addItemToOrder(id, { itemName: name, unitPrice: price });
      this.editItemName.set('');
      this.editItemPrice.set('');
    }
  }

  removeItemFromSelectedOrder(index: number) {
    const id = this.selectedOrderId();
    if (id) {
      this.orderService.removeItemFromOrder(id, index);
    }
  }

  selectedOrder = computed(() => {
    const id = this.selectedOrderId();
    return id ? this.apiOrders().find(o => o.orderId === id) || null : null;
  });

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      console.log('Attempting to delete order:', orderId);
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          console.log('Order deleted successfully:', orderId);
          this.loadOrders();
          if (this.selectedOrderId() === orderId) {
            this.selectedOrderId.set(null);
          }
        },
        error: (err) => {
          console.error('Full error object:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error body:', err.error);
          const errorMsg = err.error?.error || err.error?.message || err.message || 'Unknown error';
          alert(`Failed to delete order: ${errorMsg}`);
        }
      });
    }
  }

  onOrderCreated(): void {
    this.loadOrders();
  }
 
  filteredOrders = computed(() => {
    const q = this.orderSearch()?.trim(); 
    const list = this.apiOrders(); 
    
    if (!q) return list;
    return list.filter(o => 
      String(o.orderId).includes(q) ||
      (o.customerName && o.customerName.includes(q)) || 
      (o.customerEmail && o.customerEmail.includes(q)) || 
      (o.status && o.status.includes(q)) 
    );
  });
}