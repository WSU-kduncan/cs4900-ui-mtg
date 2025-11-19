import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Exported Interfaces ---

export interface Card { 
  name: string; 
  count: number; 
  price: number; 
}

export interface Order {
  orderID: number;
  orderStatusTypeID: number;
  statusDescription: string;
  customerEmail: string;
  employeeEmail?: string;
  orderDate: string;
  cards: Card[];
}

export interface Worker {
  employeeID: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  
  // Base API URL
  private readonly api = 'http://localhost:8080/MTG-Service';


  // 2. Local signal state for orders
  private orderList = signal<Order[]>([]);

  // 3. Expose Read-Only Signal for components
  orders = this.orderList.asReadonly();

  // --- HTTP Methods ---

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}/orders`);
  }

  // --- Local State Actions ---

  addOrder(order: Order): void {
    this.orderList.update(orders => [order, ...orders]);
    // TODO: POST to backend
  }

  generateNewOrderID(): number {
    // If list is empty, start at 5000, otherwise find max
    const currentOrders = this.orderList();
    const maxId = currentOrders.length > 0 
      ? Math.max(...currentOrders.map(o => o.orderID)) 
      : 5000;
    return maxId + 1;
  }
  
  updateStatus(id: number, newStatus: string): void {
    this.orderList.update(orders => 
      orders.map(o => o.orderID === id ? { ...o, statusDescription: newStatus } : o)
    );
  }

  // --- Test Data Link ---
  getUsers(): Observable<Worker[]> {
    return this.http.get<Worker[]>('http://localhost:8080/MTG-Service/orders');
  }
}