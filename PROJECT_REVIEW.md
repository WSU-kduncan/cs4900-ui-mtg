# Angular Project Review - MTG Orders Manager (Woessner Homework 2)

**Date:** November 25, 2025  
**Reviewer:** Erik Jenkins  
**Branch:** woessner-homework-2  
**Angular Version:** 20.3.0

---

## Executive Summary

This Angular project demonstrates implementation of an orders management component with form handling and data display. However, this project **does not meet the homework 2 criteria** which require service-based state management, event binding to add items via service, child components with signal inputs, and proper state management through a service. The project contains a single component that manages all state locally without using a service or child components.

**Overall Grade: ❌ FAIL** (Does not meet homework 2 requirements)

---

## Criteria Assessment

### ❌ Criterion 1: Data and related logic are refactored into a provided service.

**Status:** **NOT SATISFIED**

**Evidence:**
- ❌ No service file exists in the project
- ❌ No service is provided in `app.config.ts`
- ❌ All data and logic are contained within the component

**Service Configuration:**

```7:13:mtg-ui/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
```

**Component State Management (All Local):**

```36:55:mtg-ui/src/app/features/order/orders/orders.component.ts
  orders = signal<Order[]>([
    {
      orderID: 5001,
      orderStatusTypeID: 1,
      statusDescription: 'Pending',
      customerEmail: 'sara@mtgshop.com',
      employeeEmail: 'noah.stone@mtgshop.com',
      orderDate: '2025-10-01T10:00:00',
      cards: [{ name: 'Lightning Bolt', count: 4, price: 2.5 }],
    },
    {
      orderID: 5002,
      orderStatusTypeID: 2,
      statusDescription: 'Paid',
      customerEmail: 'mike@mtgshop.com',
      employeeEmail: 'lia.park@mtgshop.com',
      orderDate: '2025-10-02T12:30:00',
      cards: [{ name: 'Sol Ring', count: 1, price: 15 }],
    },
  ]);
```

**Issues:**
- ❌ No service exists to manage order data
- ❌ Data is hardcoded directly in the component
- ❌ Business logic (ID generation, filtering) is in the component
- ❌ No separation of concerns

**Expected Implementation:**
A service should be created (e.g., `OrderService`) that:
- Manages order data state using signals
- Contains methods for adding, updating, and retrieving orders
- Is provided in `app.config.ts`
- Is injected into components using `inject()`

---

### ✅ Criterion 2: Event binding is used to add new items to the list via the service.

**Status:** **PARTIALLY SATISFIED** (Event binding exists but no service)

**Evidence:**
- ✅ Event binding `(click)` is used on the "Add Order" button
- ✅ Event binding `(click)` is used on the "Add Card" button
- ❌ The event handler does NOT use a service (adds directly to component state)

**Event Binding Implementation:**

```66:66:mtg-ui/src/app/features/order/orders/order.component.html
    <button (click)="addOrder()">Add Order</button>
```

```52:52:mtg-ui/src/app/features/order/orders/order.component.html
      <button type="button" (click)="addCard()">+</button>
```

**Component Method (No Service):**

```86:109:mtg-ui/src/app/features/order/orders/orders.component.ts
  addOrder(): void {
    const customer = this.newOrderCustomer().trim();
    const employee = this.newOrderEmployee().trim();
    const status = this.newOrderStatus().trim();
    const cards = this.cards();
    if (!customer || !status || cards.length === 0) return;

    const maxId = Math.max(...this.orders().map((o) => o.orderID), 5000);
    const newOrder: Order = {
      orderID: maxId + 1,
      orderStatusTypeID: 0,
      statusDescription: status,
      customerEmail: customer,
      employeeEmail: employee || undefined,
      orderDate: new Date().toISOString(),
      cards: [...cards],
    };

    this.orders.update((list) => [newOrder, ...list]);
    this.newOrderCustomer.set('');
    this.newOrderEmployee.set('');
    this.newOrderStatus.set('');
    this.cards.set([]);
  }
```

**Issues:**
- ❌ `addOrder()` directly updates component state (`this.orders.update()`)
- ❌ No service method is called
- ❌ Business logic (ID generation) is in the component
- ❌ State management is not centralized

**Strengths:**
- ✅ Event binding is correctly implemented
- ✅ Form validation exists
- ✅ Form is cleared after addition

**Note:** While event binding is correctly used, the requirement specifies adding items "via the service", which is not met.

---

### ❌ Criterion 3: A new child component is created with a signal input().

**Status:** **NOT SATISFIED**

**Evidence:**
- ❌ No child components exist in the project
- ❌ No components use `input()` signal inputs
- ❌ All functionality is in a single component

**Component Structure:**

```16:22:mtg-ui/src/app/features/order/orders/orders.component.ts
@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
```

**Template Structure:**
- All order display logic is in the parent template
- No child components are rendered
- No signal inputs are used

**Expected Implementation:**
A child component should be created (e.g., `OrderDetailComponent`) that:
- Uses `input.required<Order>()` for signal input
- Receives order data from parent component
- Displays order details
- Is rendered in the parent template with property binding

---

### ❌ Criterion 4: The parent component renders the child component and correctly passes data.

**Status:** **NOT SATISFIED**

**Evidence:**
- ❌ No child component exists to render
- ❌ No parent-child component relationship exists
- ❌ No data passing via property binding

**Current Template:**

```86:128:mtg-ui/src/app/features/order/orders/order.component.html
    <ul class="orders-list">
      @for (o of filtered(); track o.orderID) {
        <li class="order-item">
          <div class="order-card">
            <div class="order-header">
              <strong>Order #{{ o.orderID }}</strong>
              <select
                [value]="o.statusDescription"
                (change)="changeStatus(o, $any($event.target).value)"
              >
                @for (s of statusOptions; track s) {
                  <option [value]="s">{{ s }}</option>
                }
              </select>
            </div>

            <div class="order-meta">
              <div>Customer: {{ o.customerEmail }}</div>
              <div>Employee: {{ o.employeeEmail ?? '—' }}</div>
              <div>Date: {{ o.orderDate | date: 'short' }}</div>
            </div>

            <div class="order-actions">
              <button (click)="toggleDetail(o.orderID)">
                {{ detailId() === o.orderID ? 'Hide' : 'View' }} details
              </button>
            </div>

            @if (detailId() === o.orderID) {
              <div class="detail-box">
                <p><strong>Cards:</strong></p>
                <ul>
                  @for (c of o.cards; track c.name) {
                    <li>{{ c.count }}× {{ c.name }} @ ${{ c.price.toFixed(2) }}</li>
                  }
                </ul>
                <p><strong>Total:</strong> ${{ totalCost(o.cards).toFixed(2) }}</p>
              </div>
            }
          </div>
        </li>
      }
    </ul>
```

**Issues:**
- ❌ All order display logic is inline in the parent template
- ❌ No child component selector is used
- ❌ No property binding to pass data to child

**Expected Implementation:**
```html
@for (o of filtered(); track o.orderID) {
  <app-order-detail [order]="o"></app-order-detail>
}
```

---

### ❌ Criterion 5: The overall application state is managed correctly through the service.

**Status:** **NOT SATISFIED**

**Evidence:**
- ❌ No service exists to manage state
- ❌ All state is managed locally in the component
- ❌ No centralized state management

**Component State (All Local):**

```24:35:mtg-ui/src/app/features/order/orders/orders.component.ts
  loading = signal(false);
  query = signal('');

  newOrderCustomer = signal('');
  newOrderEmployee = signal('');
  newOrderStatus = signal('');
  newCardName = signal('');
  newCardCount = signal(1);
  newCardPrice = signal(2.5);
  cards = signal<Card[]>([]);
  detailId = signal<number | null>(null);

  orders = signal<Order[]>([...]);
```

**Issues:**
- ❌ Order data is stored in component, not service
- ❌ No shared state across components
- ❌ No single source of truth
- ❌ State cannot be accessed by other components

**Expected Implementation:**
- Service should manage order data state
- Components should inject service and access state
- State updates should go through service methods
- Multiple components can share the same state

---

### ✅ Criterion 6: Follows good styling practices and has a clear commit structure.

**Status:** **FULLY SATISFIED**

**Styling Practices:**

**Evidence:**
- Component-scoped SCSS file exists
- Well-organized CSS with clear structure
- Consistent styling and design

**Component-Scoped Stylesheet:**

```21:21:mtg-ui/src/app/features/order/orders/orders.component.ts
  styleUrls: ['./order.component.scss'],
```

**Styling Highlights:**

```1:94:mtg-ui/src/app/features/order/orders/order.component.scss
.orders-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;

  h2 { margin-bottom: 1rem; }

  .add-order-form {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f7f7f7;
    border-radius: 8px;

    h3 { width: 100%; margin: 0 0 .5rem; font-size: 1rem; }

    input, select {
      padding: .5rem .75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      flex: 1 1 200px;
    }
    button {
      padding: .5rem 1rem;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: #fff;
      cursor: pointer;
      &:hover { background: #125a9c; }
    }
  }

  .order-search {
    display: flex;
    gap: .5rem;
    margin-bottom: 1rem;
    input {
      flex: 1;
      padding: .5rem .75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: .5rem 1rem;
      border: 1px solid #1976d2;
      background: #fff;
      color: #1976d2;
      border-radius: 4px;
      cursor: pointer;
      &.link { border: none; background: none; color: #1976d2; }
    }
  }

  .orders-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 1rem;
  }

  .order-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pill {
    padding: .25rem .5rem;
    border-radius: 12px;
    font-size: .75rem;
    background: #e0e0e0;
    &.status-pending   { background: #ffe082; }
    &.status-paid      { background: #81d4fa; }
    &.status-fulfilled { background: #a5d6a7; }
    &.status-cancelled { background: #ef9a9a; }
  }

  .order-meta { font-size: .875rem; color: #555; }
  .order-actions { align-self: flex-end; }
}
```

**Styling Strengths:**
- ✅ Component-scoped styles (prevents style leakage)
- ✅ Well-organized SCSS with clear sections
- ✅ Consistent color scheme and visual design
- ✅ Modern CSS features (Flexbox, Grid)
- ✅ Hover states for better UX
- ✅ Clean, readable code structure
- ✅ Responsive considerations (flex-wrap, max-width)

**Commit Structure:**

**Evidence from Git History:**
- Clear, descriptive commit messages
- Logical progression of features

**Sample Commits:**
```
76c4942 added cards to orderds and changing status
a5adb4b made buttons and outputs
64d37d7 updated and Working
34ab7c2 Orders
```

**Commit Structure Strengths:**
- ✅ Descriptive commit messages that explain what was done
- ✅ Commits are logically organized
- ✅ Commits show progression of work

---

## Additional Observations

### Positive Aspects

1. **Modern Angular Practices:**
   - Uses Angular 20.3.0 (latest version)
   - Standalone components
   - Signal-based reactive programming
   - Modern control flow syntax (`@for`, `@if`)

2. **Code Organization:**
   - Clear component structure
   - Proper TypeScript typing
   - Component files organized (`.ts`, `.html`, `.scss`)

3. **Type Safety:**
   - Comprehensive `Order` and `Card` type definitions
   - Proper TypeScript typing throughout

4. **User Experience:**
   - Search functionality with reactive filtering
   - Form validation
   - Empty state handling
   - Expandable order details
   - Status change functionality

5. **Styling:**
   - Clean, professional design
   - Consistent spacing and typography
   - Interactive elements have hover states

### Critical Missing Requirements

1. **No Service:**
   - No service file exists
   - No service provided in app.config.ts
   - All state managed in component

2. **No Child Components:**
   - No child components created
   - No signal inputs used
   - All functionality in single component

3. **No State Management Through Service:**
   - State is local to component
   - No shared state
   - No centralized management

---

## Recommendations

### Required Changes to Meet Homework 2 Criteria

1. **Create OrderService:**
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class OrderService {
     private readonly orderList = signal<Order[]>([...]);
     readonly orders = this.orderList.asReadonly();
     
     addOrder(order: Order): void {
       this.orderList.update(list => [order, ...list]);
     }
     
     updateOrderStatus(orderID: number, status: string): void {
       this.orderList.update(list =>
         list.map(o => o.orderID === orderID 
           ? { ...o, statusDescription: status }
           : o
         )
       );
     }
   }
   ```

2. **Provide Service in app.config.ts:**
   ```typescript
   providers: [
     // ... existing providers
     OrderService
   ]
   ```

3. **Create Child Component with Signal Input:**
   ```typescript
   @Component({
     selector: 'app-order-detail',
     standalone: true,
     imports: [CommonModule],
     templateUrl: './order-detail.component.html',
   })
   export class OrderDetailComponent {
     readonly order = input.required<Order>();
   }
   ```

4. **Update Parent Component to Use Service:**
   ```typescript
   export class OrdersComponent {
     private readonly orderService = inject(OrderService);
     readonly orders = this.orderService.orders;
     
     addOrder(): void {
       // ... validation
       this.orderService.addOrder(newOrder);
     }
   }
   ```

5. **Render Child Component in Parent Template:**
   ```html
   @for (o of filtered(); track o.orderID) {
     <app-order-detail [order]="o"></app-order-detail>
   }
   ```

---

## Conclusion

This Angular project demonstrates **good understanding** of Angular fundamentals including signals, modern control flow syntax, form handling, and styling. However, it **does not meet the homework 2 requirements** which specifically require:

1. Service-based state management
2. Event binding that adds items via service
3. Child components with signal inputs
4. Parent-child component data passing
5. Centralized state management through service

The project appears to be implementing homework 1 requirements (standalone component, data array, @for loop, scoped CSS, @if blocks) rather than homework 2 requirements (service, child components, signal inputs).

**Only one of six criteria is fully satisfied (styling and commit structure).**

### Final Grades by Criterion

| Criterion | Status | Points | Notes |
|-----------|--------|--------|-------|
| 1. Data refactored into provided service | ❌ Fail | 0/1 | No service exists |
| 2. Event binding adds items via service | ⚠️ Partial Pass | 0.5/1 | Event binding exists but no service used |
| 3. Child component with signal input() | ❌ Fail | 0/1 | No child components exist |
| 4. Parent renders child and passes data | ❌ Fail | 0/1 | No child components to render |
| 5. State managed through service | ❌ Fail | 0/1 | No service exists for state management |
| 6. Good styling and commit structure | ✅ Pass | 1/1 | Component-scoped SCSS, clear commits |

**Overall Homework Grade: 17% - 1.5/6**

**Key Issues:** 
- Missing service architecture entirely
- No child components created
- No signal inputs used
- State managed locally instead of through service

**Recommendation:** This project needs significant refactoring to meet homework 2 requirements. The foundation is solid, but the service-based architecture and component communication patterns must be implemented.
