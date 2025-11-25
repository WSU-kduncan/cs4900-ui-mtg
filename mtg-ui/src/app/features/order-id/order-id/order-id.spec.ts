
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderIdComponent } from './order-id';
import { OrderService } from '../order.service'; 

describe('OrderIdComponent', () => {
  let component: OrderIdComponent;
  let fixture: ComponentFixture<OrderIdComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
  
      imports: [OrderIdComponent],

    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIdComponent);
    component = fixture.componentInstance;
    
  
    fixture.detectChanges();
    await fixture.whenStable(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});