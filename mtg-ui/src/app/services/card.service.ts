import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../shared/models/card.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  private http = inject(HttpClient);

  /** Get all cards from the API */
  getAll(): Observable<Card[]> {
    return this.http.get<Card[]>('http://localhost:8080/MTG-Service/card');
  }

  /** Search cards by name on the client API (if you wired such an endpoint). */
  searchByName(q: string): Observable<Card[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<Card[]>(`${'http://localhost:8080/MTG-Service/card'}/search`, { params });
  }

  /** Update price / stock (or other fields) for a given cardNumber. */
  updateCard(cardNumber: number, patch: Partial<Card>): Observable<Card> {
    // if your API key is not cardNumber, swap this part of the URL
    return this.http.patch<Card>(`${'http://localhost:8080/MTG-Service/card'}/${cardNumber}`, patch);
  }
}
