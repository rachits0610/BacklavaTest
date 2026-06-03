import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePsswordModalComponent } from './change-pssword-modal.component';

describe('ChangePsswordModalComponent', () => {
  let component: ChangePsswordModalComponent;
  let fixture: ComponentFixture<ChangePsswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePsswordModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePsswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
