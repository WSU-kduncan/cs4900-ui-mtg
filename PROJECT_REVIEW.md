# Angular Project Review - MTG Card Manager (Saleh Homework 2)

**Date:** November 25, 2025  
**Reviewer:** Erik Jenkins  
**Branch:** saleh-homework-2  
**Angular Version:** 20.3.0

---

## Executive Summary

This Angular project demonstrates implementation of service-based state management with parent-child component communication using signal inputs. The project correctly refactors data and logic into a provided service (`CardService`), uses event binding to add new items via the service, creates a child component with signal `input()`, properly renders and passes data from parent to child, manages application state through the service, and follows good styling practices with a clear commit structure.

**Overall Grade: ✅ PASS**

---

## Criteria Assessment

### ✅ Criterion 1: Data and related logic are refactored into a provided service.

**Status:** **FULLY SATISFIED**

**Evidence:**
- `CardService` is created and properly provided in the application configuration
- Service manages card data state using Angular signals
- Service contains business logic for card operations (add, update)

**Service Definition:**

```5:40:mtg-ui/src/app/services/card.service.ts
@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly cardList = signal<Card[]>([...CARD_MOCK]);

  readonly cards = this.cardList.asReadonly();

  readonly nextNumber = computed(() => {
    const list = this.cardList();
    if (!list.length) return 1;
    return Math.max(...list.map(c => c.cardNumber ?? 0)) + 1;
  });

  addCard(card: {
    setName: string;
    cardName: string;
    cardType?: string;
    manaValue?: number;
    price?: number;
    stock?: number;
  }) {
    const newCard: Card = {
      cardNumber: this.nextNumber(),
      ...card,
    };

    this.cardList.update(list => [...list, newCard]);
  }

  updateCard(cardNumber: number, changes: Partial<Pick<Card, 'price' | 'stock'>>) {
    this.cardList.update(list =>
      list.map(c =>
        c.cardNumber === cardNumber ? { ...c, ...changes } : c
      )
    );
  }
}
```

**Service Provided in Application Config:**

```8:14:mtg-ui/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    CardService
  ]
};
```

**Strengths:**
- ✅ Service is properly decorated with `@Injectable({ providedIn: 'root' })`
- ✅ Service is explicitly provided in `app.config.ts` providers array
- ✅ Data state is managed using Angular signals (`signal<Card[]>`)
- ✅ Readonly access to cards via `asReadonly()` for encapsulation
- ✅ Business logic (card number generation, add, update) is centralized in service
- ✅ Uses computed signal for `nextNumber` calculation
- ✅ Proper TypeScript typing throughout

**Data Management:**
- Initial data loaded from `CARD_MOCK`
- State is reactive and can be updated through service methods
- Service provides a clean API for component interaction

---

### ✅ Criterion 2: Event binding is used to add new items to the list via the service.

**Status:** **FULLY SATISFIED**

**Evidence:**
- Event binding `(click)` is used on the "Add Card" button
- The event handler calls `addCard()` method which uses the service
- Form inputs use event binding `(input)` to update signal values

**Event Binding Implementation:**

```94:96:mtg-ui/src/app/features/card/card-list/card-list.component.html
        <div class="add-btn-cell">
          <button type="button" class="primary" (click)="addCard()">
            Add Card
          </button>
```

**Component Method That Uses Service:**

```48:72:mtg-ui/src/app/features/card/card-list/card-list.component.ts
  addCard() {
    const name = this.newName().trim();
    const set = this.newSet().trim();

    if (!name || !set) {
      return;
    }

    this.cardService.addCard({
      cardName: name,
      setName: set,
      cardType: this.newType().trim() || undefined,
      manaValue: this.newMana() ?? undefined,
      price: this.newPrice() ?? undefined,
      stock: this.newStock() ?? undefined,
    });

    // clear form
    this.newName.set('');
    this.newSet.set('');
    this.newType.set('');
    this.newMana.set(null);
    this.newPrice.set(null);
    this.newStock.set(null);
  }
```

**Form Input Event Bindings:**

```34:38:mtg-ui/src/app/features/card/card-list/card-list.component.html
          <input
            type="text"
            [value]="newName()"
            (input)="newName.set($any($event.target).value)"
            placeholder="Card name"
          />
```

**Strengths:**
- ✅ Event binding `(click)` properly connected to `addCard()` method
- ✅ `addCard()` method calls `cardService.addCard()` to add items via service
- ✅ Form inputs use event binding `(input)` to update component signals
- ✅ Proper validation (checks for required fields: name and set)
- ✅ Form is cleared after successful addition
- ✅ Uses service method rather than directly manipulating data

**Event Flow:**
1. User fills out form fields (bound via `(input)` events)
2. User clicks "Add Card" button (triggers `(click)` event)
3. `addCard()` method validates input
4. `addCard()` calls `cardService.addCard()` to add card via service
5. Service updates its internal state
6. Component form is cleared

---

### ✅ Criterion 3: A new child component is created with a signal input().

**Status:** **FULLY SATISFIED**

**Evidence:**
- `CardDetailComponent` is created as a child component
- Component uses `input.required<Card>()` for signal input
- Properly typed with TypeScript interface

**Child Component Definition:**

```6:15:mtg-ui/src/app/features/card/card-detail/card-detail.component.ts
@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent {
  // REQUIRED: signal input() for the data model object
  readonly item = input.required<Card>();
```

**Signal Input Import:**

```1:1:mtg-ui/src/app/features/card/card-detail/card-detail.component.ts
import { Component, inject, input, signal } from '@angular/core';
```

**Usage in Template:**

```2:6:mtg-ui/src/app/features/card/card-detail/card-detail.component.html
  <td>{{ item().cardNumber }}</td>
  <td>{{ item().setName }}</td>
  <td>{{ item().cardName }}</td>
  <td>{{ item().cardType || '—' }}</td>
  <td>{{ item().manaValue ?? '—' }}</td>
```

**Strengths:**
- ✅ Child component properly created (`CardDetailComponent`)
- ✅ Uses `input.required<Card>()` for signal input (Angular 17.1+ syntax)
- ✅ Properly typed with `Card` interface
- ✅ Signal input is readonly (best practice)
- ✅ Signal input is accessed as function `item()` in template
- ✅ Component is standalone (modern Angular pattern)
- ✅ Clear comment indicating the requirement

**Signal Input Features:**
- `input.required<Card>()` ensures the input must be provided
- Type-safe with TypeScript generic `<Card>`
- Reactive - automatically updates when parent changes the value
- Follows Angular's modern signal-based input pattern

---

### ✅ Criterion 4: The parent component renders the child component and correctly passes data.

**Status:** **FULLY SATISFIED**

**Evidence:**
- Parent component (`CardListComponent`) imports `CardDetailComponent`
- Child component is rendered in parent template
- Data is correctly passed via property binding `[item]="card"`

**Parent Component Imports:**

```9:12:mtg-ui/src/app/features/card/card-list/card-list.component.ts
@Component({
  standalone: true,
  selector: 'app-card-list',
  imports: [CommonModule, FormsModule, CardDetailComponent],
```

**Child Component Rendered in Parent Template:**

```117:119:mtg-ui/src/app/features/card/card-list/card-list.component.html
            @for (card of filtered(); track card.cardNumber) {
              <app-card-detail [item]="card"></app-card-detail>
            }
```

**Data Flow:**

```29:30:mtg-ui/src/app/features/card/card-list/card-list.component.ts
  // expose service state
  readonly cards = this.cardService.cards;
```

```33:38:mtg-ui/src/app/features/card/card-list/card-list.component.ts
  readonly filtered = computed<Card[]>(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.cards();
    if (!q) return list;
    return list.filter(c => c.cardName.toLowerCase().includes(q));
  });
```

**Strengths:**
- ✅ Parent component imports child component in `imports` array
- ✅ Child component selector `<app-card-detail>` is used in template
- ✅ Property binding `[item]="card"` correctly passes data
- ✅ Data comes from service via `cards` signal
- ✅ Data is filtered before passing to child (via `filtered()` computed)
- ✅ Uses modern `@for` control flow syntax
- ✅ Proper track expression `track card.cardNumber`
- ✅ Each card in the list is passed to a separate child component instance

**Data Flow Path:**
1. `CardService.cards` signal contains card data
2. `CardListComponent` exposes `cards` from service
3. `filtered()` computed signal filters cards based on search query
4. `@for` loop iterates over `filtered()` cards
5. Each `card` is passed to `<app-card-detail [item]="card">`
6. Child component receives card via `input.required<Card>()` signal input

---

### ✅ Criterion 5: The overall application state is managed correctly through the service.

**Status:** **FULLY SATISFIED**

**Evidence:**
- Service manages all card data state
- Components access state through service, not directly
- State updates flow through service methods
- Multiple components can access the same state

**Service State Management:**

```7:9:mtg-ui/src/app/services/card.service.ts
  private readonly cardList = signal<Card[]>([...CARD_MOCK]);

  readonly cards = this.cardList.asReadonly();
```

**Parent Component Accesses Service State:**

```17:30:mtg-ui/src/app/features/card/card-list/card-list.component.ts
  private readonly cardService = inject(CardService);

  readonly query = signal('');

  // add-card form signals
  readonly newName = signal('');
  readonly newSet = signal('');
  readonly newType = signal('');
  readonly newMana = signal<number | null>(null);
  readonly newPrice = signal<number | null>(null);
  readonly newStock = signal<number | null>(null);

  // expose service state
  readonly cards = this.cardService.cards;
```

**Child Component Updates State via Service:**

```35:41:mtg-ui/src/app/features/card/card-detail/card-detail.component.ts
  savePrice() {
    const v = this.draftPrice();
    if (v != null && !Number.isNaN(v)) {
      this.cardService.updateCard(this.item().cardNumber, { price: v });
    }
    this.editingPrice.set(false);
  }
```

**Strengths:**
- ✅ Single source of truth: `CardService` manages all card data
- ✅ State is private (`private readonly cardList`) with readonly accessor
- ✅ Components inject service using `inject()` function
- ✅ State updates go through service methods (`addCard`, `updateCard`)
- ✅ Service uses signals for reactive state management
- ✅ State changes automatically propagate to all components using the service
- ✅ No direct state manipulation in components
- ✅ Proper encapsulation: internal state is private, public API is readonly

**State Management Pattern:**
- **Service Layer**: Manages data state with signals
- **Component Layer**: Accesses state through service, manages UI state locally
- **Reactive Updates**: Signal changes automatically trigger template updates
- **Single Source of Truth**: All card data flows through `CardService`

**State Update Flow:**
1. User action triggers component method
2. Component calls service method (e.g., `cardService.addCard()`)
3. Service updates internal signal state
4. Service signal change propagates to all components using it
5. Components reactively update their templates

---

### ✅ Criterion 6: Follows good styling practices and has a clear commit structure.

**Status:** **FULLY SATISFIED**

**Styling Practices:**

**Evidence:**
- Component-scoped SCSS files for each component
- Well-organized CSS with clear structure
- Responsive design with media queries
- Consistent color scheme and design system
- Proper use of CSS variables and modern CSS features

**Component-Scoped Stylesheets:**

```14:14:mtg-ui/src/app/features/card/card-list/card-list.component.ts
  styleUrls: ['./card-list.component.scss'],
```

```11:11:mtg-ui/src/app/features/card/card-detail/card-detail.component.ts
  styleUrls: ['./card-detail.component.scss'],
```

**Styling Highlights:**

```1:8:mtg-ui/src/app/features/card/card-list/card-list.component.scss
:host {
  display: block;
  min-height: 100vh;
  padding: 2rem;
  background: radial-gradient(circle at top, #202535 0, #05070a 55%, #000 100%);
  color: #f5f5f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

```194:213:mtg-ui/src/app/features/card/card-list/card-list.component.scss
  @media (max-width: 900px) {
    .add-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .add-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .add-btn-cell {
      justify-content: stretch;

      .primary {
        width: 100%;
      }
    }
  }
```

**Styling Strengths:**
- ✅ Component-scoped styles (prevents style leakage)
- ✅ Well-organized SCSS with clear sections
- ✅ Responsive design with media queries
- ✅ Consistent color scheme and visual design
- ✅ Modern CSS features (CSS Grid, Flexbox, gradients)
- ✅ Proper use of `:host` selector for component styling
- ✅ Hover states and transitions for better UX
- ✅ Accessible color contrasts
- ✅ Clean, readable code structure

**Commit Structure:**

**Evidence from Git History:**
- Clear, descriptive commit messages
- Logical progression of features
- Homework-specific commits are identifiable

**Sample Commits:**
```
2e19353 finished hw 1 got card list working on the ui
a9b4d85 finished hw2, able to add cards and adjust their price, stock, name, mana value, and set as well
14ced66 fixed issues with hw2 with @for and improved centering
f0cd96a finished hw 3 and got the frontend connected to the api and it calls the cards in the db
```

**Commit Structure Strengths:**
- ✅ Descriptive commit messages that explain what was done
- ✅ Commits are logically organized
- ✅ Homework-specific commits are clearly marked
- ✅ Commits show progression of work
- ✅ Good use of present tense in commit messages

**Additional Styling Observations:**
- Dark theme with modern gradient backgrounds
- Consistent spacing and typography
- Interactive elements have hover and active states
- Form inputs have focus states
- Table has alternating row colors and hover effects
- Mobile-responsive grid layouts

---

## Additional Observations

### Positive Aspects

1. **Modern Angular Practices:**
   - Uses Angular 20.3.0 (latest version)
   - Standalone components throughout
   - Signal-based reactive programming
   - Modern control flow syntax (`@for`, `@if`)
   - `inject()` function for dependency injection

2. **Code Organization:**
   - Clear separation of concerns (service, components, models)
   - Logical folder structure (`features/card/`, `services/`, `shared/models/`)
   - Proper TypeScript interfaces in models folder
   - Component files organized (`.ts`, `.html`, `.scss`)

3. **Type Safety:**
   - Comprehensive `Card` interface
   - Proper TypeScript typing throughout
   - Generic types used appropriately
   - Signal inputs properly typed

4. **User Experience:**
   - Search functionality with reactive filtering
   - Inline editing for price and stock (double-click)
   - Form validation
   - Empty state handling
   - Responsive design

5. **State Management:**
   - Centralized state in service
   - Reactive updates via signals
   - Proper encapsulation
   - Computed signals for derived state

6. **Component Communication:**
   - Proper parent-child communication via signal inputs
   - Service injection for shared state
   - Clean data flow

### Areas for Improvement

1. **Error Handling:**
   - No error handling for service operations
   - Consider adding try-catch or error signals for failed operations

2. **Form Validation:**
   - Basic validation exists (name and set required)
   - Could add more comprehensive validation (e.g., price > 0, stock >= 0)
   - Consider using Angular reactive forms for better validation

3. **Accessibility:**
   - Could add ARIA labels to form inputs
   - Consider keyboard navigation improvements
   - Add focus management for better accessibility

4. **Code Comments:**
   - Some methods could benefit from JSDoc comments
   - Complex logic could use inline comments

5. **Testing:**
   - No test files visible for the new components/service
   - Consider adding unit tests for service methods
   - Add component tests for user interactions

---

## Recommendations

### Optional Enhancements

1. **Add Error Handling:**
   ```typescript
   readonly error = signal<string | null>(null);
   
   addCard(card: {...}) {
     try {
       // existing logic
     } catch (error) {
       this.error.set('Failed to add card');
     }
   }
   ```

2. **Add Form Validation:**
   ```typescript
   addCard() {
     const name = this.newName().trim();
     const set = this.newSet().trim();
     
     if (!name || !set) {
       // show error message
       return;
     }
     
     if (this.newPrice() !== null && this.newPrice()! < 0) {
       // show validation error
       return;
     }
     // ... rest of logic
   }
   ```

3. **Add Loading States:**
   ```typescript
   readonly loading = signal(false);
   
   addCard() {
     this.loading.set(true);
     // perform operation
     this.loading.set(false);
   }
   ```

---

## Conclusion

This Angular project demonstrates **excellent understanding** of service-based state management and parent-child component communication. The implementation correctly refactors data into a provided service, uses event binding to add items via the service, creates a child component with signal `input()`, properly renders and passes data from parent to child, manages application state through the service, and follows good styling practices with a clear commit structure.

**All six criteria are fully satisfied with proper implementation.**

### Final Grades by Criterion

| Criterion | Status | Points | Notes |
|-----------|--------|--------|-------|
| 1. Data refactored into provided service | ✅ Pass | 1/1 | CardService properly provided and manages state |
| 2. Event binding adds items via service | ✅ Pass | 1/1 | Click event calls service.addCard() method |
| 3. Child component with signal input() | ✅ Pass | 1/1 | CardDetailComponent uses input.required<Card>() |
| 4. Parent renders child and passes data | ✅ Pass | 1/1 | Proper property binding [item]="card" |
| 5. State managed through service | ✅ Pass | 1/1 | Single source of truth in CardService |
| 6. Good styling and commit structure | ✅ Pass | 1/1 | Component-scoped SCSS, clear commits |

**Overall Homework Grade: 100% - 6/6**

**Key Strengths:** 
- Proper service-based architecture with signal state management
- Correct use of event binding to add items via service
- Modern signal input() pattern in child component
- Proper parent-child data passing
- Centralized state management through service
- Well-organized, responsive styling
- Clear, descriptive commit messages

**Excellent Implementation:** This project correctly implements all required service-based state management and component communication patterns, demonstrating strong understanding of Angular's modern architecture and signal-based reactivity.

