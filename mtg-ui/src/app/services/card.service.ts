import { Injectable, signal } from '@angular/core';
import { Card } from '../shared/models/card.model';
import { CARD_MOCK } from '../features/card/card.mock';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly cardList = signal<Card[]>(CARD_MOCK);

  readonly cards = this.cardList.asReadonly();

  addCard(card: Card): void {
    this.cardList.update(list => [...list, card]);
  }

  nextCardNumber(): number {
    const list = this.cardList();
    if (!list.length) return 1;
    return Math.max(...list.map(c => c.cardNumber)) + 1;
  }
}
