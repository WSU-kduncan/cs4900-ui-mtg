import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-id.html',
  styleUrls: ['./worker-id.scss'],
})
export class WorkerId {
  title = 'Worker ID Component';
  workers = [
    {
      employeeId: 101,
      firstName: 'Ava',
      lastName: 'Reed',
      email: 'ava.reed@mtgshop.com',
      role: 'Administrator'
    },
    {
      employeeId: 102,
      firstName: 'Noah',
      lastName: 'Stone',
      email: 'noah.stone@mtgshop.com',
      role: 'Salesperson'
    },
    {
      employeeId: 103,
      firstName: 'Lia',
      lastName: 'Park',
      email: 'lia.park@mtgshop.com',
      role: 'Manager'
    }
  ];

  orders = [
    { orderId: 5001, employeeId: 102, customer: 'sara@mtgshop.com', orderDate: '2025-10-01T10:00:00', status: 'Pending', items: [] },
    { orderId: 5002, employeeId: 103, customer: 'mike@mtgshop.com', orderDate: '2025-10-02T12:30:00', status: 'Paid', items: [] },
    { orderId: 5003, employeeId: 101, customer: 'josh@mtgshop.com', orderDate: '2025-10-03T15:45:00', status: 'Fulfilled', items: [] },
  ];

  selectedWorkerId: number | null = null;
  orderSearch = '';
  workerSearch = '';

  selectWorker(id?: number) {
    this.selectedWorkerId = id ?? null;
    this.orderSearch = '';
  }

  get selectedWorker() {
    if (!this.selectedWorkerId) return null;
    return this.workers.find(w => w.employeeId === this.selectedWorkerId) || null;
  }

  get filteredOrders() {
    if (!this.selectedWorkerId) return [];
    const workerOrders = this.orders.filter(o => o.employeeId === this.selectedWorkerId);
    const q = this.orderSearch.trim().toLowerCase();
    if (!q) return workerOrders;
    return workerOrders.filter(o =>
      String(o.orderId).includes(q) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q))
    );
  }

  get filteredWorkers() {
    const q = this.workerSearch?.trim().toLowerCase();
    if (!q) return this.workers;
    return this.workers.filter(w =>
      String(w.employeeId).includes(q) ||
      (w.firstName && w.firstName.toLowerCase().includes(q)) ||
      (w.lastName && w.lastName.toLowerCase().includes(q)) ||
      (w.email && w.email.toLowerCase().includes(q)) ||
      (w.role && w.role.toLowerCase().includes(q))
    );
  }

  getOrderCountForWorker(id: number) {
    return this.orders.filter(o => o.employeeId === id).length;
  }

  hasActiveOrders(id: number) {
    return this.orders.some(o => {
      if (o.employeeId !== id) return false;
      const s = (o.status || '').toLowerCase();
      return s !== 'delivered' && s !== 'fulfilled';
    });
  }
}
