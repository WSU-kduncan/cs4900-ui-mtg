import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



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
  
 
  private readonly api = 'http://localhost:8080/MTG-Service';


  
  private orderList = signal<Order[]>([]);

 
  orders = this.orderList.asReadonly();

  

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}/orders`);
  }

 

  addOrder(order: Order): void {
    this.orderList.update(orders => [order, ...orders]);
    
  }

  generateNewOrderID(): number {
    
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