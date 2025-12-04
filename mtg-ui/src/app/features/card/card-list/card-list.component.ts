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
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit() {
    this.isLoading.set(true);
    this.cardService.getAll().subscribe({
      next: (data) => {
        this.cards.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load cards. Please check if the server is running.');
      },
    });
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
    this.cardService.create(card).subscribe({
      next: (savedCard) => {
        this.cards.set([...this.cards(), savedCard]);
      },
      error: () => {
        alert('Failed to create card. Please try again.');
      }
    });
  }
  
  onCardDeleted() {
    this.cardService.getAll().subscribe({
      next: (data) => this.cards.set(data)
    });
  }
}
