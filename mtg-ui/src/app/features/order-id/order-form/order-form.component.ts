import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrderFormComponent {

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);

  orderCreated = output<void>();

  orderForm = this.fb.group({
    customerName: [''],
    customerEmail: ['', [Validators.required, Validators.email]],
    employeeId: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    status: ['Pending', Validators.required]
  });

  onSubmit(): void {
    if (!this.orderForm.valid) {
      alert('Please fill in all required fields.');
      return;
    }

    const form = this.orderForm.value;

    const newOrder = {
      customerName: form.customerName || '',
      customerEmail: form.customerEmail || '',
      employeeId: Number(form.employeeId),
      status: form.status || 'Pending',
      items: []
    };

    this.orderService.createOrder(newOrder).subscribe({
      next: () => {
        this.orderForm.reset({ status: 'Pending' });
        this.orderCreated.emit();
      },
      error: (err) => {
        console.error(err);
        alert("Failed to create order.");
      }
    });
  }
}
