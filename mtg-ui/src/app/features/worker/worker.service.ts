import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { Observable } from 'rxjs';

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
export class WorkerService {
  private http = inject(HttpClient);
  private workerList = signal<Worker[]>([
    // {
    //   employeeID: 101,
    //   firstName: 'Ava',
    //   lastName: 'Reed',
    //   email: 'ava.reed@mtgshop.com',
    //   role: 'Administrator'
    // },
    // {
    //   employeeID: 102,
    //   firstName: 'Noah',
    //   lastName: 'Stone',
    //   email: 'noah.stone@mtgshop.com',
    //   role: 'Salesperson'
    // },
    // {
    //   employeeID: 103,
    //   firstName: 'Lia',
    //   lastName: 'Park',
    //   email: 'lia.park@mtgshop.com',
    //   role: 'Manager'
    // }
  ]);

  workers = this.workerList.asReadonly();

  getUsers(): Observable<Worker[]> {
    return this.http.get<any>('http://localhost:8080/MTG-Service/workers')

  }

  addWorker(worker: Worker): void {
    this.workerList.update(workers => [...workers, worker]);
  }

  getWorkerById(id: number): Worker | undefined {
    return this.workerList().find(w => w.employeeID === id);
  }

  generateNewEmployeeID(): number {
    const maxId = Math.max(...this.workerList().map(w => w.employeeID), 0);
    return maxId + 1;
  }
}
