import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationRequestAcceptRejectComponent } from './cancellation-request-accept-reject.component';

describe('CancellationRequestAcceptRejectComponent', () => {
  let component: CancellationRequestAcceptRejectComponent;
  let fixture: ComponentFixture<CancellationRequestAcceptRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancellationRequestAcceptRejectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationRequestAcceptRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
