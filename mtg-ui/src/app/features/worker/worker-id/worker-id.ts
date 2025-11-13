import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerService } from '../worker.service';
import { WorkerDetailComponent } from '../worker-detail/worker-detail.component';

@Component({
  selector: 'app-worker-id',
  standalone: true,
  imports: [CommonModule, WorkerDetailComponent],
  templateUrl: './worker-id.html',
  styleUrls: ['./worker-id.scss'],
})
export class WorkerId {
  title = 'Worker ID Component';
  
  workerService = new WorkerService();
  workers = this.workerService.workers;

  orders = [
    { orderId: 5001, employeeId: 102, customer: 'sara@mtgshop.com', orderDate: '2025-10-01T10:00:00', status: 'Pending', items: [] },
    { orderId: 5002, employeeId: 103, customer: 'mike@mtgshop.com', orderDate: '2025-10-02T12:30:00', status: 'Paid', items: [] },
    { orderId: 5003, employeeId: 101, customer: 'josh@mtgshop.com', orderDate: '2025-10-03T15:45:00', status: 'Fulfilled', items: [] },
  ];

  selectedWorkerId = signal<number | null>(null);
  orderSearch = signal('');
  workerSearch = signal('');
  newWorkerFirstName = signal('');
  newWorkerLastName = signal('');
  newWorkerEmail = signal('');
  newWorkerRole = signal('');

  selectWorker(id?: number) {
    this.selectedWorkerId.set(id ?? null);
    this.orderSearch.set('');
  }

  addWorker() {
    const firstName = this.newWorkerFirstName();
    const lastName = this.newWorkerLastName();
    const email = this.newWorkerEmail();
    const role = this.newWorkerRole();

    if (firstName && lastName && email && role) {
      const newWorker = {
        employeeId: this.workerService.generateNewEmployeeId(),
        firstName,
        lastName,
        email,
        role
      };
      this.workerService.addWorker(newWorker);
      this.newWorkerFirstName.set('');
      this.newWorkerLastName.set('');
      this.newWorkerEmail.set('');
      this.newWorkerRole.set('');
    }
  }

  get selectedWorker() {
    const id = this.selectedWorkerId();
    if (!id) return null;
    return this.workerService.getWorkerById(id) || null;
  }

  get filteredOrders() {
    const id = this.selectedWorkerId();
    if (!id) return [];
    const workerOrders = this.orders.filter(o => o.employeeId === id);
    const q = this.orderSearch().trim().toLowerCase();
    if (!q) return workerOrders;
    return workerOrders.filter(o =>
      String(o.orderId).includes(q) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q))
    );
  }

  get filteredWorkers() {
    const q = this.workerSearch()?.trim().toLowerCase();
    if (!q) return this.workers();
    return this.workers().filter(w =>
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
