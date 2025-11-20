import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService, OrderItem } from '../order.service';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
})
export class OrderForm {
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
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      
      const newOrder = {
        customerName: formValue.customerName || '',
        customerEmail: formValue.customerEmail || '',
        employeeId: parseInt(formValue.employeeId || '0'),
        status: formValue.status || 'Pending',
        items: []
      };

      console.log('Submitting new order:', newOrder);

      this.orderService.createOrder(newOrder).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          this.orderForm.reset({ status: 'Pending' });
          this.orderCreated.emit();
        },
        error: (err) => {
          console.error('Error creating order:', err);
          console.error('Error details:', err.error);
          alert(`Failed to create order: ${err.error?.message || err.statusText || 'Server error'}`);
        }
      });
    } else {
      console.warn('Form validation failed:', {
        formValid: this.orderForm.valid,
        errors: this.orderForm.errors
      });
      alert('Please fill in all required fields.');
    }
  }
}
