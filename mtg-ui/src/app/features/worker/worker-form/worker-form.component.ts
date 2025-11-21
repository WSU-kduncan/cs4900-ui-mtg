import { Component, inject, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkerService, Worker } from '../worker.service';

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
  
  workerAdded = output<Worker>();

  workerForm!: FormGroup;
  isLoading = false;

  ngOnInit() {
    this.workerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.workerForm.valid) {
      this.isLoading = true;
      const newWorker = this.workerForm.value;
      
      this.workerService.createWorker(newWorker).subscribe({
        next: (createdWorker: Worker) => {
          this.isLoading = false;
          this.workerAdded.emit(createdWorker);
          this.workerForm.reset();
        },
        error: (error) => {
          const newWorkerWithID: Worker = {
            employeeID: Math.floor(Math.random() * 10000),
            ...newWorker
          };
          this.isLoading = false;
          this.workerAdded.emit(newWorkerWithID);
          this.workerForm.reset();
        }
      });
    } else {
      Object.keys(this.workerForm.controls).forEach(key => {
        this.workerForm.get(key)?.markAsTouched();
      });
    }
  }
}
