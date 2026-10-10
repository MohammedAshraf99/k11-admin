import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutlistComponent } from './checkoutlist.component';

describe('CheckoutlistComponent', () => {
  let component: CheckoutlistComponent;
  let fixture: ComponentFixture<CheckoutlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
