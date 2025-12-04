import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../shared/models/card.model';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent {
  @Output() createCard = new EventEmitter<Card>();

  cardNumber = signal<number | null>(null);
  setName = signal('');
  cardName = signal('');
  cardType = signal('');
  cardCondition = signal('NM');
  manaValue = signal<number | null>(null);
  price = signal<number | null>(null);
  stock = signal<number | null>(null);

  submitCard() {
    const newCard: Card = {
      cardNumber: this.cardNumber() ?? Math.floor(Math.random() * 1000),
      setName: this.setName(),
      cardName: this.cardName(),
      cardType: this.cardType(),
      cardCondition: this.cardCondition(),
      manaValue: this.manaValue() ?? 0,
      price: this.price() ?? 0,
      stock: this.stock() ?? 0,
    };

    this.createCard.emit(newCard);

    this.cardNumber.set(null);
    this.setName.set('');
    this.cardName.set('');
    this.cardType.set('');
    this.cardCondition.set('NM');
    this.manaValue.set(null);
    this.price.set(null);
    this.stock.set(null);
  }
}
