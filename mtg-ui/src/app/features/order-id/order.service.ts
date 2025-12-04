import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ApiOrderItem {
  orderItemID: number;
  cardNumber: number;
  setName: string;
  quantity: number;
  price: number;
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
  orderItemID?: number;
  cardNumber?: number;
  setName?: string;
  quantity?: number;
  price?: number;
  // For display purposes
  itemName?: string;
  unitPrice?: number;
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
  private readonly baseUrl = 'http://localhost:8080';

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
    return items.reduce((sum, item) => sum + (item.unitPrice || item.price || 0), 0);
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
      `${this.baseUrl}/orders`,
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
            orderItemID: i.orderItemID,
            cardNumber: i.cardNumber,
            setName: i.setName,
            quantity: i.quantity,
            price: i.price,
            // Create display name for UI
            itemName: `${i.cardNumber} - ${i.setName} (x${i.quantity})`,
            unitPrice: i.price * i.quantity
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

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customers`, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  createOrder(orderData: {
    customerName: string;
    customerEmail: string;
    employeeId: number;
    status: string;
    items: OrderItem[];
  }): Observable<any> {
    const payload = {
      orderStatusTypeID: this.getStatusId(orderData.status),
      customerEmail: orderData.customerEmail,
      employeeID: orderData.employeeId
    };

    return this.http.post(`${this.baseUrl}/orders`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  private getStatusId(status: string): number {
    switch (status) {
      case 'Pending': return 1;
      case 'Paid': return 2;
      case 'Fulfilled': return 3;
      case 'Canceled': return 4;
      default: return 1;
    }
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

  updateOrderStatus(order: Order, newStatus: string): Observable<void> {
    const statusId = this.getStatusId(newStatus);
    const payload = {
      orderID: order.orderId,
      orderStatusTypeID: statusId,
      customerEmail: order.customerEmail,
      employeeID: order.employeeId
    };
    
    return this.http.put<void>(`${this.baseUrl}/orders/${order.orderId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  addItemToOrder(orderId: number, item: OrderItem): Observable<void> {
    const payload = {
      cardNumber: item.cardNumber,
      setName: item.setName,
      quantity: item.quantity,
      price: item.price
    };
    
    return this.http.post<void>(`${this.baseUrl}/orders/${orderId}/items`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  removeItemFromOrder(orderId: number, cardNumber: number, setName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${orderId}/items/${cardNumber}/${setName}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}
