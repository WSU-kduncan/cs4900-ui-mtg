import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent {
  orders = [
    { id: 5001, name: 'Order 5001 – sara@mtgshop.com' },
    { id: 5002, name: 'Order 5002 – mike@mtgshop.com' },
    { id: 5003, name: 'Order 5003 – josh@mtgshop.com' }
  ];
}