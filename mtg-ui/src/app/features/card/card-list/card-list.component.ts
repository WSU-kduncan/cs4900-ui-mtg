import { Component, computed, signal, inject } from '@angular/core';
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
  private cardService = inject(CardService);

  readonly loading = signal(false);
  readonly query = signal('');

  readonly cards = signal<Card[]>([]);

  constructor() {
    this.loadCards();
  }

  loadCards() {
    this.loading.set(true);
    this.cardService.getAll().subscribe({
      next: (res) => {
        this.cards.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.cards();
    if (!q) return list;
    return list.filter((c) => c.cardName.toLowerCase().includes(q));
  });

  onSearch() {}
  onClear() {
    this.query.set('');
  }

  trackByCard = (_: number, c: Card) => c.cardNumber;
}
