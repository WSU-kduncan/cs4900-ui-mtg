import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../shared/models/card.model';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
})
export class CardDetailComponent {
  @Input({ required: true }) item!: Card;

  private cardService = inject(CardService);

  // Inline editing state
  readonly editingPrice = signal(false);
  readonly editingStock = signal(false);

  readonly draftPrice = signal<number | null>(null);
  readonly draftStock = signal<number | null>(null);

  startPriceEdit() {
    this.draftPrice.set(this.item.price);
    this.editingPrice.set(true);
  }

  startStockEdit() {
    this.draftStock.set(this.item.stock);
    this.editingStock.set(true);
  }

  savePrice() {
    const price = this.draftPrice();
    if (price == null) return;

    this.cardService.updateCard(this.item.cardNumber, { price }).subscribe(() => {
      this.item.price = price;
      this.editingPrice.set(false);
    });
  }

  saveStock() {
    const stock = this.draftStock();
    if (stock == null) return;

    this.cardService.updateCard(this.item.cardNumber, { stock }).subscribe(() => {
      this.item.stock = stock;
      this.editingStock.set(false);
    });
  }

  cancelPrice() {
    this.editingPrice.set(false);
  }

  cancelStock() {
    this.editingStock.set(false);
  }
}
