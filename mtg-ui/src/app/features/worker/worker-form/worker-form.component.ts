import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerService, Worker } from '../worker.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './worker-form.component.html',
  styleUrls: ['./worker-form.component.scss']
})
export class WorkerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workerService = inject(WorkerService);
  
  workerAdded$ = new Subject<Worker>();

  workerForm!: FormGroup;
  isLoading = signal(false);
  formInitialized = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    this.workerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      role: ['']
    });
    this.formInitialized.set(true);
  }

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    
    if (this.workerForm.valid) {
      this.isLoading.set(true);
      const newWorker = this.workerForm.value;
      
      this.workerService.createWorker(newWorker).subscribe({
        next: (createdWorker: Worker) => {
          this.isLoading.set(false);
          this.successMessage.set('Worker created successfully!');
          this.workerAdded$.next(createdWorker);
          this.workerForm.reset();
        },
        error: (error) => {
          this.isLoading.set(false);
          
          if (error.status === 404) {
            this.errorMessage.set('Service endpoint not found. Please check if the backend is running.');
          } else if (error.status === 0) {
            this.errorMessage.set('Cannot connect to server. Please check if the backend is running.');
          } else {
            this.errorMessage.set('Failed to create worker.');
          }
          
          const newWorkerWithID: Worker = {
            employeeID: Math.floor(Math.random() * 10000),
            ...newWorker
          };
          this.workerAdded$.next(newWorkerWithID);
          this.workerForm.reset();
        }
      });
    }
  }
}
