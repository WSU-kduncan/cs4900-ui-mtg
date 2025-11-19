// order-id.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderIdComponent } from './order-id';
import { OrderService } from '../order.service'; // Import the service

describe('OrderIdComponent', () => {
  let component: OrderIdComponent;
  let fixture: ComponentFixture<OrderIdComponent>;
  // We can get a reference to the service if needed, but the current fix doesn't require it

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Because your component is standalone: true, it goes in imports
      imports: [OrderIdComponent],
      // No need to provide OrderService as it's providedIn: 'root' and will be found
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIdComponent);
    component = fixture.componentInstance;
    
    // *** FIX: Call detectChanges and wait for stability before running tests ***
    // This ensures that the @for loop and required inputs get their initial values
    // from the OrderService's synchronous signal state.
    fixture.detectChanges();
    await fixture.whenStable(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Optional: Verify that we have 3 orders (matches your mock data)
  it('should have 3 orders in the list', () => {
    // We can use the service's internal signal or the component's getter for this
    expect(component.orders().length).toBe(3);
    // OR: expect(component.filteredOrders.length).toBe(3);
  });
});