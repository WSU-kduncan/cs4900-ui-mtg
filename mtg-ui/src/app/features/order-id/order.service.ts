import { Injectable, signal } from '@angular/core';

export interface OrderItem {
  itemName: string;
  unitPrice: number;
}

export interface Order {
  orderId: number;
  customerName: string;
  customerEmail: string;
  employeeId: number; // ✅ NEW: Added Employee ID
  status: string;
  items: OrderItem[];
  orderDate: Date;
  get totalPrice(): number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private orderList = signal<Order[]>([
    {
      orderId: 5001,
      customerName: 'Sara Nguyen',
      customerEmail: 'sara@mtgshop.com',
      employeeId: 101, // ✅ Added dummy ID
      status: 'Pending',
      orderDate: new Date('2025-10-01T10:00:00'),
      items: [
        { itemName: 'Black Lotus', unitPrice: 15000.00 },
        { itemName: 'Mox Pearl', unitPrice: 4000.00 }
      ],
      get totalPrice() { return this.items.reduce((sum, item) => sum + item.unitPrice, 0); }
    },
    {
      orderId: 5002,
      customerName: 'Mike Lopez',
      customerEmail: 'mike@mtgshop.com',
      employeeId: 102, // ✅ Added dummy ID
      status: 'Paid',
      orderDate: new Date('2025-10-02T12:30:00'),
      items: [ { itemName: 'Sol Ring', unitPrice: 2.50 } ],
      get totalPrice() { return this.items.reduce((sum, item) => sum + item.unitPrice, 0); }
    },
    {
      orderId: 5003,
      customerName: 'Josh Kim',
      customerEmail: 'josh@mtgshop.com',
      employeeId: 101, // ✅ Added dummy ID
      status: 'Fulfilled',
      orderDate: new Date('2025-10-03T15:45:00'),
      items: [ { itemName: 'Lightning Bolt', unitPrice: 1.50 } ],
      get totalPrice() { return this.items.reduce((sum, item) => sum + item.unitPrice, 0); }
    }
  ]);

  orders = this.orderList.asReadonly();

  addOrder(order: Order): void {
    this.orderList.update(current => [order, ...current]);
  }

  getOrderById(id: number): Order | undefined {
    return this.orderList().find(o => o.orderId === id);
  }

  generateNewOrderId(): number {
    const maxId = Math.max(...this.orderList().map(o => o.orderId), 5000);
    return maxId + 1;
  }

  updateOrderStatus(id: number, newStatus: string): void {
    this.orderList.update(orders => 
      orders.map(order => 
        order.orderId === id ? { ...order, status: newStatus } : order
      )
    );
  }
}