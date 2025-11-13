import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type Card = {
  cardNumber: number;
  setName: string;
  cardName: string;
  cardType?: string;
  manaValue: number;
  price: number;
  stock: number;
};

@Component({
  standalone: true,
  selector: 'app-card-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  readonly cards = signal<Card[]>([
    {
      cardNumber: 1,
      setName: 'LEA',
      cardName: 'Black Lotus',
      cardType: 'Artifact',
      manaValue: 0,
      price: 25000,
      stock: 1,
    },
    {
      cardNumber: 2,
      setName: 'LEB',
      cardName: 'Mox Sapphire',
      cardType: 'Artifact',
      manaValue: 0,
      price: 8500,
      stock: 2,
    },
    {
      cardNumber: 3,
      setName: '2XM',
      cardName: 'Lightning Bolt',
      cardType: 'Instant',
      manaValue: 1,
      price: 3.5,
      stock: 120,
    },
    {
      cardNumber: 4,
      setName: 'MPS',
      cardName: 'Sol Ring',
      cardType: 'Artifact',
      manaValue: 1,
      price: 2.0,
      stock: 300,
    },
    {
      cardNumber: 5,
      setName: 'MH2',
      cardName: 'Ragavan, Nimble Pilferer',
      cardType: 'Creature',
      manaValue: 1,
      price: 68,
      stock: 14,
    },
  ]);

  readonly cardTypes: string[] = [
    'Creature',
    'Artifact',
    'Instant',
    'Sorcery',
    'Enchantment',
    'Planeswalker',
    'Land',
  ];

  readonly loading = signal(false);
  readonly query = signal('');

  newName = '';
  newSetCode = '';
  newType = '';
  newMana = 0;
  newPrice = 0;
  newStock = 0;

  editingPriceId: number | null = null;
  editingStockId: number | null = null;

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.cards();
    return this.cards().filter((c) =>
      c.cardName.toLowerCase().includes(q)
    );
  });


  load() {
    this.loading.set(false);
  }

  onSearch() {
  }

  clearSearch() {
    this.query.set('');
  }

  addCard() {
    const name = this.newName.trim();
    const set = this.newSetCode.trim();

    if (!name || !set) {
      return; 
    }

    const current = this.cards();
    const nextNumber =
      current.length > 0
        ? Math.max(...current.map((c) => c.cardNumber)) + 1
        : 1;

    const card: Card = {
      cardNumber: nextNumber,
      setName: set,
      cardName: name,
      cardType: this.newType || undefined,
      manaValue: this.newMana ?? 0,
      price: this.newPrice ?? 0,
      stock: this.newStock ?? 0,
    };

    this.cards.update((list) => [...list, card]);

    this.newName = '';
    this.newSetCode = '';
    this.newType = '';
    this.newMana = 0;
    this.newPrice = 0;
    this.newStock = 0;
  }

  updateCard(card: Card, changes: Partial<Card>) {
    this.cards.update((list) =>
      list.map((c) =>
        c.cardNumber === card.cardNumber ? { ...c, ...changes } : c
      )
    );
  }

  trackByKey = (_: number, c: Card) => `${c.cardNumber}|${c.setName}`;
}
