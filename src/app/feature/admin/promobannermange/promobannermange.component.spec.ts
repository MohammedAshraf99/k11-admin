import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromobannermangeComponent } from './promobannermange.component';

describe('PromobannermangeComponent', () => {
  let component: PromobannermangeComponent;
  let fixture: ComponentFixture<PromobannermangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromobannermangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromobannermangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
