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
    console.log('Loading cards from backend...');
    this.isLoading.set(true);
    this.cardService.getAll().subscribe({
      next: (data) => {
        console.log('Cards loaded successfully:', data);
        console.log('Number of cards:', data.length);
        this.cards.set(data);
        this.isLoading.set(false);
        this.errorMessage.set(null);
      },
      error: (error) => {
        console.error('Error loading cards:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.isLoading.set(false);

        if (error.status === 0) {
          this.errorMessage.set(
            'Cannot connect to server. CORS policy may be blocking the request. Please check if the backend is running and CORS is configured.'
          );
        } else if (error.status === 404) {
          this.errorMessage.set('Card service endpoint not found. Please verify the backend URL is correct.');
        } else {
          this.errorMessage.set(`Failed to load cards: ${error.message || 'Unknown error'}`);
        }

        this.cards.set([]);
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
    this.cards.set([...this.cards(), card]);
  }
}
