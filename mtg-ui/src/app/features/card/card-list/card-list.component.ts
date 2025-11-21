import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../shared/models/card.model';
import { CardService } from '../../../services/card.service';
import { CardDetailComponent } from '../card-detail/card-detail.component';
import { CardFormComponent } from '../card-form/card-form.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardDetailComponent, CardFormComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
  constructor(private cardService: CardService) {}

  cards = signal<Card[]>([]);
  query = signal('');

  ngOnInit() {
    this.cardService.getAll().subscribe((data) => this.cards.set(data));
  }

  filteredCards = computed(() => {
    const q = this.query().toLowerCase();
    return this.cards().filter((c) =>
      c.cardName.toLowerCase().includes(q)
    );
  });

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.query.set(val);
  }

  onClear() {
    this.query.set('');
  }

  trackByCard = (_: number, c: Card) => c.cardNumber;

  createCard(card: Card) {
    this.cards.set([...this.cards(), card]);
  }
}
