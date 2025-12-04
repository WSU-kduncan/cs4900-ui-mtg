import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrderService, Order, OrderItem } from '../order.service';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'app-order-id',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderFormComponent, OrderDetailComponent],
  templateUrl: './order-id.html',
  styleUrls: ['./order-id.scss']
})
export class OrderIdComponent {

  private orderService = inject(OrderService);
  private cardService = inject(CardService);
  
  orders = signal<Order[]>([]);
  orderSearch = signal<string>('');
  selectedOrder = signal<Order | null>(null);

  pastedText = '';
  
  // Edit item fields
  editCardNumber = signal<string>('');
  editSetName = signal<string>('');
  editQuantity = signal<number>(1);
  editPrice = signal<number>(0);

  constructor() {
    this.orderService.getOrders().subscribe({
      next: list => {
        this.orders.set(list);
        // Also update the service's internal order list for local modifications
        list.forEach(order => this.orderService.addOrder(order));
      },
      error: err => console.error('Error loading orders:', err)
    });
  }

  filteredOrders = computed(() => {
    const search = this.orderSearch().toLowerCase();
    return this.orders().filter(o =>
      o.customerName.toLowerCase().includes(search) ||
      o.customerEmail.toLowerCase().includes(search)
    );
  });

  onOrderCreated() {
    this.orderService.getOrders().subscribe(list => this.orders.set(list));
  }

  selectOrder(orderId?: number) {
    if (!orderId) {
      this.selectedOrder.set(null);
      return;
    }
    const found = this.orders().find(o => o.orderId === orderId) ?? null;
    this.selectedOrder.set(found);
  }

  deleteOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => o.orderId !== id));
      },
      error: err => console.error('Delete failed:', err)
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    const order = this.orders().find(o => o.orderId === orderId);
    if (!order) return;

    this.orderService.updateOrderStatus(order, newStatus).subscribe({
      next: () => {
        this.orders.update(list =>
          list.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)
        );
      },
      error: err => console.error('Update failed:', err)
    });
  }

  appendPastedItems() {
    if (!this.pastedText.trim()) return;

    const newItems = this.pastedText
      .split('\n')
      .map(line => ({ itemName: line.trim(), unitPrice: 0 }));

    const newOrder: Order = {
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

  addCardItemToOrder() {
    console.log('Add button clicked');
    const order = this.selectedOrder();
    console.log('Selected order:', order);
    
    if (!order) {
      console.log('No order selected');
      return;
    }

    const cardNum = this.editCardNumber().trim();
    const setName = this.editSetName().trim();
    const quantity = this.editQuantity();
    const price = this.editPrice();

    console.log('Form values:', { cardNum, setName, quantity, price });

    if (!cardNum || !setName || quantity <= 0) {
      alert('Please fill in card number, set name, and valid quantity');
      return;
    }

    // First, check if the card exists in the database
    this.cardService.getOne(parseInt(cardNum), setName.toUpperCase()).subscribe({
      next: (card) => {
        // Card exists, check if there's enough stock
        if (card.stock < quantity) {
          alert(`Not enough stock! Only ${card.stock} available for ${card.cardName} (${setName})`);
          return;
        }

        // Card exists and has enough stock, proceed to add to order
        const newItem: OrderItem = {
          cardNumber: parseInt(cardNum),
          setName: setName.toUpperCase(),
          quantity: quantity,
          price: price
        };

        console.log('Sending item to backend:', newItem);

        this.orderService.addItemToOrder(order.orderId, newItem).subscribe({
          next: () => {
            console.log('Item added successfully to backend');
            // Wait a bit for backend to process, then reload
            setTimeout(() => {
              this.reloadOrders();
            }, 500);
            this.editCardNumber.set('');
            this.editSetName.set('');
            this.editQuantity.set(1);
            this.editPrice.set(0);
          },
          error: err => {
            console.error('Failed to add item:', err);
            alert(`Error adding item: ${err.message || 'Unknown error'}`);
          }
        });
      },
      error: (err) => {
        // Card doesn't exist
        console.error('Card not found:', err);
        alert(`Card ${cardNum} from set ${setName.toUpperCase()} is not in stock or does not exist in the database.`);
      }
    });
  }

  removeItemFromSelectedOrder(index: number) {
    const order = this.selectedOrder();
    if (!order) return;

    const item = order.items[index];
    if (!item?.cardNumber || !item?.setName) {
      console.error('Cannot remove item: missing cardNumber or setName');
      return;
    }

    this.orderService.removeItemFromOrder(order.orderId, item.cardNumber, item.setName).subscribe({
      next: () => {
        this.reloadOrders();
      },
      error: err => console.error('Failed to remove item:', err)
    });
  }

  reloadOrders() {
    console.log('Reloading orders from backend...');
    this.orderService.getOrders().subscribe({
      next: list => {
        console.log('Orders reloaded:', list);
        this.orders.set(list);
        const currentSelectedId = this.selectedOrder()?.orderId;
        if (currentSelectedId) {
          const updated = list.find(o => o.orderId === currentSelectedId);
          console.log('Updated selected order:', updated);
          this.selectedOrder.set(updated || null);
        }
      },
      error: err => console.error('Error reloading orders:', err)
    });
  }

  private calcTotal(items: OrderItem[]): number {
    return items.reduce((s, i) => s + (i.unitPrice || i.price || 0), 0);
  }
}
