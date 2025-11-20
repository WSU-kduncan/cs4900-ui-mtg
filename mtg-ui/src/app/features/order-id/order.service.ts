import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ApiOrderItem {
  orderItemID: number;
  itemName: string;
  unitPrice: number;
}

export interface ApiOrder {
  orderID: number;
  orderStatusTypeID: number;
  customerEmail: string;
  employeeID: number;
  orderDate: any;
  orderItems: ApiOrderItem[];
}

export interface OrderItem {
  itemName: string;
  unitPrice: number;
}

export interface Order {
  orderId: number;
  customerName: string;
  customerEmail: string;
  employeeId: number;
  status: string;
  items: OrderItem[];
  orderDate: Date;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private mapStatus(id: number): string {
    switch (id) {
      case 1: return 'Pending';
      case 2: return 'Paid';
      case 3: return 'Fulfilled';
      case 4: return 'Canceled';
      default: return 'Pending';
    }
  }

  private extractName(email: string): string {
    if (!email) return 'Unknown';
    const userPart = email.split('@')[0];
    const parts = userPart.split(/[._-]/);
    return parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private calcTotal(items: OrderItem[]): number {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + item.unitPrice, 0);
  }

  private parseJavaDate(dateInput: any): Date {
    if (!dateInput) return new Date();

    if (Array.isArray(dateInput)) {
      return new Date(
        dateInput[0],
        dateInput[1] - 1,
        dateInput[2],
        dateInput[3] || 0,
        dateInput[4] || 0,
        dateInput[5] || 0
      );
    }

    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiOrder[]>(
      'http://localhost:8080/orders',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      }
    ).pipe(
      map(apiOrders =>
        apiOrders.map(api => {
          const realItems: OrderItem[] = (api.orderItems || []).map(i => ({
            itemName: i.itemName,
            unitPrice: i.unitPrice
          }));

          return {
            orderId: api.orderID,
            customerName: this.extractName(api.customerEmail),
            customerEmail: api.customerEmail,
            employeeId: api.employeeID,
            status: this.mapStatus(api.orderStatusTypeID),
            orderDate: this.parseJavaDate(api.orderDate),
            items: realItems,
            totalPrice: this.calcTotal(realItems)
          };
        })
      )
    );
  }

  private orderList = signal<Order[]>([]);
  orders = this.orderList.asReadonly();

  addOrder(order: Order): void {
    this.orderList.update(current => [order, ...current]);
  }

  generateNewOrderId(): number {
    const current = this.orderList();
    if (current.length === 0) return 5001;
    const maxId = Math.max(...current.map(o => o.orderId));
    return maxId + 1;
  }

  updateOrderStatus(id: number, newStatus: string): void {
    this.orderList.update(orders =>
      orders.map(order =>
        order.orderId === id ? { ...order, status: newStatus } : order
      )
    );
  }

  addItemToOrder(orderId: number, item: OrderItem): void {
    this.orderList.update(orders =>
      orders.map(order => {
        if (order.orderId === orderId) {
          const newItems = [...order.items, item];
          return {
            ...order,
            items: newItems,
            totalPrice: this.calcTotal(newItems)
          };
        }
        return order;
      })
    );
  }

  removeItemFromOrder(orderId: number, itemIndex: number): void {
    this.orderList.update(orders =>
      orders.map(order => {
        if (order.orderId === orderId) {
          const newItems = order.items.filter((_, index) => index !== itemIndex);
          return {
            ...order,
            items: newItems,
            totalPrice: this.calcTotal(newItems)
          };
        }
        return order;
      })
    );
  }
}
