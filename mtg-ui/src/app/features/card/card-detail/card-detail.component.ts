import { Component, Input, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../shared/models/card.model';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent {
  @Input({ required: true }) item!: Card;
  
  cardDeleted = output<void>();
  private cardService = inject(CardService);

  editingPrice = signal(false);
  editingStock = signal(false);

  draftPrice = signal<number | null>(null);
  draftStock = signal<number | null>(null);

  enablePriceEdit() {
    this.editingPrice.set(true);
    this.draftPrice.set(this.item.price ?? 0);
  }

  enableStockEdit() {
    this.editingStock.set(true);
    this.draftStock.set(this.item.stock ?? 0);
  }

  cancelPrice() {
    this.editingPrice.set(false);
    this.draftPrice.set(null);
  }

  cancelStock() {
    this.editingStock.set(false);
    this.draftStock.set(null);
  }
  
  deleteCard() {
    if (confirm(`Delete card "${this.item.cardName}"?`)) {
      this.cardService.delete(this.item.cardNumber, this.item.setName).subscribe({
        next: () => this.cardDeleted.emit()
      });
    }
  }
}
