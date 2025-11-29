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
    console.log('Form initialized, valid:', this.workerForm.valid);
    
    // Watch form changes
    this.workerForm.valueChanges.subscribe(() => {
      console.log('Form changed, valid:', this.workerForm.valid, 'value:', this.workerForm.value);
    });
  }

  onSubmit() {
    const msg1 = 'FORM SUBMIT START';
    console.log(msg1);
    localStorage.setItem('debug1', msg1);
    
    // Clear previous messages
    this.errorMessage.set(null);
    this.successMessage.set(null);
    
    if (this.workerForm.valid) {
      const msg2 = 'Form valid - sending to backend';
      console.log(msg2);
      localStorage.setItem('debug2', msg2);
      
      this.isLoading.set(true);
      const newWorker = this.workerForm.value;
      
      this.workerService.createWorker(newWorker).subscribe({
        next: (createdWorker: Worker) => {
          const msg3 = 'SUCCESS - calling workerAdded emit';
          console.log(msg3);
          localStorage.setItem('debug3', msg3);
          this.isLoading.set(false);
          this.successMessage.set('Worker created successfully!');
          this.workerAdded$.next(createdWorker);
          this.workerForm.reset();
        },
        error: (error) => {
          const msg4 = 'ERROR - ' + (error?.message || 'unknown');
          console.error('Error creating worker:', error);
          localStorage.setItem('debug4', msg4);
          
          this.isLoading.set(false);
          
          // Set user-friendly error message
          if (error.status === 404) {
            this.errorMessage.set('Service endpoint not found. Please check if the backend is running.');
          } else if (error.status === 0) {
            this.errorMessage.set('Cannot connect to server. Please check if the backend is running.');
          } else {
            this.errorMessage.set(`Failed to create worker: ${error.message || 'Unknown error'}`);
          }
          
          // Fallback: create mock worker for development
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
