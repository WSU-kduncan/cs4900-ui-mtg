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
 
  ]);

  workers = this.workerList.asReadonly();

  getUsers(): Observable<Worker[]> {
    return this.http.get<Worker[]>('http://localhost:8080/workers', {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  createWorker(worker: Partial<Worker>): Observable<Worker> {
    return this.http.post<Worker>('http://localhost:8080/workers', worker, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteWorker(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/workers/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
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
