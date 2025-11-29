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

  cardName = signal('');
  setName = signal('');
  cardType = signal('');
  manaValue = signal<number | null>(null);
  price = signal<number | null>(null);
  stock = signal<number | null>(null);

  submitCard() {
    const newCard: Card = {
      cardNumber: Math.floor(Math.random() * 1000),
      cardName: this.cardName(),
      setName: this.setName(),
      cardType: this.cardType(),
      manaValue: this.manaValue() ?? 0,
      price: this.price() ?? 0,
      stock: this.stock() ?? 0,
    };

    this.createCard.emit(newCard);

    this.cardName.set('');
    this.setName.set('');
    this.cardType.set('');
    this.manaValue.set(null);
    this.price.set(null);
    this.stock.set(null);
  }
}
