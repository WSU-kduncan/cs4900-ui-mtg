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
  orders() {
    throw new Error('Method not implemented.');
  }
  private orderService = inject(OrderService);
  
  apiOrders = toSignal(this.orderService.getOrders(), { initialValue: [] as Order[] });

  selectedOrderId = signal<number | null>(null);
  orderSearch = signal('');

  // Create Form
  newOrderName = signal('');
  newOrderEmail = signal('');
  newEmployeeId = signal('');
  newOrderStatus = signal('Pending');
  
  // Item Inputs
  newItemName = signal('');
  newItemQuantity = signal('1'); // ✅ Default quantity is 1
  newItemPrice = signal('');
  
  // Edit Form Inputs
  editItemName = signal('');
  editItemPrice = signal('');

  // Draft List
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
      // Note: We default to 1 here for quick edits, 
      // but you could add a quantity input for edits too.
      this.orderService.addItemToOrder(id, { itemName: name, unitPrice: price, quantity: 1 });
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
    const qty = parseInt(this.newItemQuantity());

    if (name && !isNaN(price) && !isNaN(qty) && qty > 0) {
      this.tempItems.update(items => [
        ...items, 
        { itemName: name, unitPrice: price, quantity: qty }
      ]);
      
      // Reset inputs
      this.newItemName.set('');
      this.newItemPrice.set('');
      this.newItemQuantity.set('1');
    }
  }

  removeItemFromDraft(index: number) {
    this.tempItems.update(items => items.filter((_, i) => i !== index));
  }

  draftTotal = computed(() => {
    return this.tempItems().reduce((sum, item) => {
      const q = item.quantity || 1;
      return sum + (item.unitPrice * q);
    }, 0);
  });

  createOrder() {
    const name = this.newOrderName();
    const email = this.newOrderEmail();
    const empIdStr = this.newEmployeeId();
    const status = this.newOrderStatus();
    const items = this.tempItems();
    const empId = parseInt(empIdStr);

    if (name && email && !isNaN(empId) && items.length > 0) {
      // Calculate total with quantities
      const total = items.reduce((sum, item) => {
        const q = item.quantity || 1;
        return sum + (item.unitPrice * q);
      }, 0);

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