import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  
  orders = this.orderService.orders;
  selectedOrderId = signal<number | null>(null);
  orderSearch = signal('');

  // Form Inputs
  newOrderName = signal('');
  newOrderEmail = signal('');
  newEmployeeId = signal(''); // ✅ NEW: Signal for input
  newOrderStatus = signal('Pending');
  
  // Item Inputs
  newItemName = signal('');
  newItemPrice = signal('');

  // Draft List
  tempItems = signal<OrderItem[]>([]);

  selectOrder(id?: number) {
    this.selectedOrderId.set(id ?? null);
  }

  updateStatus(id: number, newStatus: string) {
    this.orderService.updateOrderStatus(id, newStatus);
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
    const empIdStr = this.newEmployeeId(); // ✅ Get the string value
    const status = this.newOrderStatus();
    const items = this.tempItems();

    const empId = parseInt(empIdStr); // ✅ Convert to number

    // Validate: Name, Email, Valid Employee ID, and Items
    if (name && email && !isNaN(empId) && items.length > 0) {
      const newOrder: Order = {
        orderId: this.orderService.generateNewOrderId(),
        customerName: name,
        customerEmail: email,
        employeeId: empId, // ✅ Save it
        status: status,
        orderDate: new Date(),
        items: items,
        get totalPrice() { return this.items.reduce((sum, item) => sum + item.unitPrice, 0); }
      };
      
      this.orderService.addOrder(newOrder);
      
      // Reset ALL forms
      this.newOrderName.set('');
      this.newOrderEmail.set('');
      this.newEmployeeId.set(''); // ✅ Reset input
      this.newOrderStatus.set('Pending');
      this.tempItems.set([]);
    }
  }

  selectedOrder = computed(() => {
    const id = this.selectedOrderId();
    return id ? this.orders().find(o => o.orderId === id) || null : null;
  });

  filteredOrders = computed(() => {
    const q = this.orderSearch()?.trim().toLowerCase();
    const list = this.orders();
    if (!q) return list;
    return list.filter(o => 
      String(o.orderId).includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });
}