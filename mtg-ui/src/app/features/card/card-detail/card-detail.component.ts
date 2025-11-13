import { Component, inject, input, signal } from '@angular/core';
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
  // REQUIRED: signal input() for the data model object
  readonly item = input.required<Card>();

  private readonly cardService = inject(CardService);

  readonly editingPrice = signal(false);
  readonly editingStock = signal(false);

  readonly draftPrice = signal<number | null>(null);
  readonly draftStock = signal<number | null>(null);

  startEditPrice() {
    this.draftPrice.set(this.item().price ?? 0);
    this.editingPrice.set(true);
  }

  startEditStock() {
    this.draftStock.set(this.item().stock ?? 0);
    this.editingStock.set(true);
  }

  savePrice() {
    const v = this.draftPrice();
    if (v != null && !Number.isNaN(v)) {
      this.cardService.updateCard(this.item().cardNumber, { price: v });
    }
    this.editingPrice.set(false);
  }

  saveStock() {
    const v = this.draftStock();
    if (v != null && !Number.isNaN(v)) {
      this.cardService.updateCard(this.item().cardNumber, { stock: v });
    }
    this.editingStock.set(false);
  }

  cancelPrice() {
    this.editingPrice.set(false);
  }

  cancelStock() {
    this.editingStock.set(false);
  }
}
