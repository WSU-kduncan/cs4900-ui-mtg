import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerId } from './worker-id';

describe('WorkerId', () => {
  let component: WorkerId;
  let fixture: ComponentFixture<WorkerId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerId]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerId);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
