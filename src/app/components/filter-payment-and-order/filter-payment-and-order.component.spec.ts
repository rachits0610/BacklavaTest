import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPaymentAndOrderComponent } from './filter-payment-and-order.component';

describe('FilterPaymentAndOrderComponent', () => {
  let component: FilterPaymentAndOrderComponent;
  let fixture: ComponentFixture<FilterPaymentAndOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPaymentAndOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterPaymentAndOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
