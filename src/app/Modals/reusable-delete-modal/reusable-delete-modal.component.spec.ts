import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDeleteModalComponent } from './reusable-delete-modal.component';

describe('ReusableDeleteModalComponent', () => {
  let component: ReusableDeleteModalComponent;
  let fixture: ComponentFixture<ReusableDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
