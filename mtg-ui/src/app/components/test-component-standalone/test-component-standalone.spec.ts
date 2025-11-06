import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponentStandalone } from './test-component-standalone';

describe('TestComponentStandalone', () => {
  let component: TestComponentStandalone;
  let fixture: ComponentFixture<TestComponentStandalone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponentStandalone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestComponentStandalone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
