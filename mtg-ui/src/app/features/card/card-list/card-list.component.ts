import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Card = {
  cardNumber: number;
  setName: string;
  cardName: string;
  cardType?: string;
  manaValue?: number;
  price?: number;
  stock?: number;
};

@Component({
  standalone: true,
  selector: 'app-card-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  readonly loading = signal(false);
  readonly query = signal('');
  readonly cards = signal<Card[]>([
    { cardNumber: 1, setName: 'LEA', cardName: 'Black Lotus', cardType: 'Artifact', manaValue: 0, price: 25000, stock: 1 },
    { cardNumber: 2, setName: 'LEB', cardName: 'Mox Sapphire', cardType: 'Artifact', manaValue: 0, price: 8500, stock: 2 },
    { cardNumber: 3, setName: '2XM', cardName: 'Lightning Bolt', cardType: 'Instant', manaValue: 1, price: 3.5, stock: 120 },
    { cardNumber: 4, setName: 'MPS', cardName: 'Sol Ring', cardType: 'Artifact', manaValue: 1, price: 2.0, stock: 300 },
    { cardNumber: 5, setName: 'MH2', cardName: 'Ragavan, Nimble Pilferer', cardType: 'Creature', manaValue: 1, price: 68, stock: 14 },
  ]);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.cards();
    return this.cards().filter(c => c.cardName.toLowerCase().includes(q));
  });

  load() {
    // local data example—nothing to fetch. keep to satisfy template.
    this.loading.set(false);
  }

  onSearch() {
    // filtered() reacts to query(); nothing else needed
  }

  trackByKey = (_: number, c: Card) => `${c.cardNumber}|${c.setName}`;
}
