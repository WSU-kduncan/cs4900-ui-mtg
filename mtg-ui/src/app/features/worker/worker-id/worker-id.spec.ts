import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerID } from './worker-id';

describe('WorkerID', () => {
  let component: WorkerID;
  let fixture: ComponentFixture<WorkerID>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerID]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerID);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
