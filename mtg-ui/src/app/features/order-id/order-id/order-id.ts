import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop'; 
import { OrderService, Order, OrderItem } from '../order.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'app-order-id',
  standalone: true,
  imports: [CommonModule, OrderDetailComponent],
  templateUrl: './order-id.html',
  styleUrls: ['./order-id.scss']
})
export class OrderIdComponent {
  private orderService = inject(OrderService);
  
  apiOrders = toSignal(this.orderService.getOrders(), { initialValue: [] as Order[] });

  selectedOrderId = signal<number | null>(null);
  orderSearch = signal('');


  newOrderName = signal('');
  newOrderEmail = signal('');
  newEmployeeId = signal('');
  newOrderStatus = signal('Pending');
  

  newItemName = signal('');
  newItemPrice = signal('');
  
 
  editItemName = signal('');
  editItemPrice = signal('');


  tempItems = signal<OrderItem[]>([]);

  selectOrder(id?: number) {
    this.selectedOrderId.set(id ?? null);
    this.editItemName.set('');
    this.editItemPrice.set('');
  }

  updateStatus(id: number, newStatus: string) {
    this.orderService.updateOrderStatus(id, newStatus);
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

  addItemToDraft() {
    const name = this.newItemName();
    const price = parseFloat(this.newItemPrice());
    if (name && !isNaN(price)) {
      this.tempItems.update(items => [...items, { itemName: name, unitPrice: price }]);
      this.newItemName.set('');
      this.newItemPrice.set('');
    }
  }

  removeItemFromDraft(index: number) {
    this.tempItems.update(items => items.filter((_, i) => i !== index));
  }

  draftTotal = computed(() => {
    return this.tempItems().reduce((sum, item) => sum + item.unitPrice, 0);
  });

  createOrder() {
    const name = this.newOrderName();
    const email = this.newOrderEmail();
    const empIdStr = this.newEmployeeId();
    const status = this.newOrderStatus();
    const items = this.tempItems();
    const empId = parseInt(empIdStr);

    if (name && email && !isNaN(empId) && items.length > 0) {
      const total = items.reduce((sum, item) => sum + item.unitPrice, 0);

      const newOrder: Order = {
        orderId: this.orderService.generateNewOrderId(),
        customerName: name,
        customerEmail: email,
        employeeId: empId,
        status: status,
        orderDate: new Date(),
        items: items,
        totalPrice: total
      };
      
      this.orderService.addOrder(newOrder);
      
      this.newOrderName.set('');
      this.newOrderEmail.set('');
      this.newEmployeeId.set('');
      this.newOrderStatus.set('Pending');
      this.tempItems.set([]);
    }
  }

  selectedOrder = computed(() => {
    const id = this.selectedOrderId();
    return id ? this.apiOrders().find(o => o.orderId === id) || null : null;
  });

 
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