import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilterBtnComponent } from './add-filter-btn.component';

describe('AddFilterBtnComponent', () => {
  let component: AddFilterBtnComponent;
  let fixture: ComponentFixture<AddFilterBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFilterBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFilterBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
