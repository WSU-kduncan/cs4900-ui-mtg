import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Card } from '../shared/models/card.model';
import { CARD_MOCK } from '../features/card/card.mock';

@Injectable({ providedIn: 'root' })
export class CardService {
  private http = inject(HttpClient);

  // Toggle this to `true` when your API is ready
  private useApi = false;

  // If you have environments, replace this with environment.apiBase
  private readonly baseUrl = 'http://localhost:8080';

  getAll(): Observable<Card[]> {
    if (!this.useApi) return of(CARD_MOCK);
    return this.http.get<Card[]>(`${this.baseUrl}/card`);
  }

  searchByName(q: string): Observable<Card[]> {
    if (!this.useApi) {
      const query = q.trim().toLowerCase();
      return of(CARD_MOCK).pipe(
        map(list =>
          !query ? list : list.filter(c => c.cardName.toLowerCase().includes(query))
        )
      );
    }
    // if your backend supports ?q=
    return this.http.get<Card[]>(`${this.baseUrl}/card/search?q=${encodeURIComponent(q)}`);
  }
}
