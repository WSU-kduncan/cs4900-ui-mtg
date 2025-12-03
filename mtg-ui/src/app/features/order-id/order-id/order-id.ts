import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-id.html',
  styleUrls: ['./order-id.scss']
})
export class OrderIdComponent {

  pastedText: string = '';

  // Signal to store orders entered manually
  orders = signal<any[]>([]);

  appendPastedItems() {
    if (!this.pastedText.trim()) return;

    const newItems = this.pastedText
      .split('\n')
      .map(line => ({
        itemName: line.trim(),
        unitPrice: 0
      }));

    const newOrder = {
      orderId: Date.now(),
      customerName: 'Manual Entry',
      customerEmail: 'manual@entry.com',
      employeeId: 1,
      status: 'Pending',
      items: newItems,
      orderDate: new Date(),
      totalPrice: 0
    };

    this.orders.update(list => [...list, newOrder]);
    this.pastedText = '';
  }
}
