import { Injectable, computed, signal } from '@angular/core';
import { Card } from '../shared/models/card.model';
import { CARD_MOCK } from '../features/card/card.mock';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly cardList = signal<Card[]>([...CARD_MOCK]);

  readonly cards = this.cardList.asReadonly();

  readonly nextNumber = computed(() => {
    const list = this.cardList();
    if (!list.length) return 1;
    return Math.max(...list.map(c => c.cardNumber ?? 0)) + 1;
  });

  addCard(card: {
    setName: string;
    cardName: string;
    cardType?: string;
    manaValue?: number;
    price?: number;
    stock?: number;
  }) {
    const newCard: Card = {
      cardNumber: this.nextNumber(),
      ...card,
    };

    this.cardList.update(list => [...list, newCard]);
  }

  updateCard(cardNumber: number, changes: Partial<Pick<Card, 'price' | 'stock'>>) {
    this.cardList.update(list =>
      list.map(c =>
        c.cardNumber === cardNumber ? { ...c, ...changes } : c
      )
    );
  }
}
