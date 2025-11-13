import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardService } from '../../../services/card.service';
import { Card } from '../../../shared/models/card.model';
import { CardDetailComponent } from '../card-detail/card-detail.component';

@Component({
  standalone: true,
  selector: 'app-card-list',
  imports: [CommonModule, FormsModule, CardDetailComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  private readonly cardService = inject(CardService);

  readonly query = signal('');

  // add-card form signals
  readonly newName = signal('');
  readonly newSet = signal('');
  readonly newType = signal('');
  readonly newMana = signal<number | null>(null);
  readonly newPrice = signal<number | null>(null);
  readonly newStock = signal<number | null>(null);

  // expose service state
  readonly cards = this.cardService.cards;

  // filtered view
  readonly filtered = computed<Card[]>(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.cards();
    if (!q) return list;
    return list.filter(c => c.cardName.toLowerCase().includes(q));
  });

  onSearch() {
    // no-op: filtering happens reactively as query changes
  }

  resetSearch() {
    this.query.set('');
  }

  addCard() {
    const name = this.newName().trim();
    const set = this.newSet().trim();

    if (!name || !set) {
      return;
    }

    this.cardService.addCard({
      cardName: name,
      setName: set,
      cardType: this.newType().trim() || undefined,
      manaValue: this.newMana() ?? undefined,
      price: this.newPrice() ?? undefined,
      stock: this.newStock() ?? undefined,
    });

    // clear form
    this.newName.set('');
    this.newSet.set('');
    this.newType.set('');
    this.newMana.set(null);
    this.newPrice.set(null);
    this.newStock.set(null);
  }

  trackByKey = (_: number, c: Card) => `${c.cardNumber}|${c.setName}`;
}
