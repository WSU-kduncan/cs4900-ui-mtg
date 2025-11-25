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
    customerEmail: ['', Validators.required],
    employeeId: ['', Validators.required],
    status: ['Pending', Validators.required]
  });

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      
      const employeeIdValue = formValue.employeeId || '';
      const employeeId = isNaN(Number(employeeIdValue)) ? 0 : Number(employeeIdValue);
      
      const newOrder = {
        customerName: formValue.customerName || '',
        customerEmail: formValue.customerEmail || '',
        employeeId: employeeId,
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
          console.error('Full error object:', err);
          console.error('Error status:', err.status);
          console.error('Error statusText:', err.statusText);
          console.error('Error message:', err.message);
          console.error('Error body:', err.error);
          const errorMsg = err.error?.error || err.error?.message || err.statusText || err.message || 'Unknown error';
          alert(`Failed to create order: ${errorMsg}`);
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
