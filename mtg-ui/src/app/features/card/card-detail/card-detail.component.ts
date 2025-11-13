import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../shared/models/card.model';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent {
  card = input.required<Card>();
}
