import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface Worker {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private workerList = signal<Worker[]>([
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
  ]);

  workers = this.workerList.asReadonly();

  addWorker(worker: Worker): void {
    this.workerList.update(workers => [...workers, worker]);
  }

  getWorkerById(id: number): Worker | undefined {
    return this.workerList().find(w => w.employeeId === id);
  }

  generateNewEmployeeId(): number {
    const maxId = Math.max(...this.workerList().map(w => w.employeeId), 0);
    return maxId + 1;
  }
}
