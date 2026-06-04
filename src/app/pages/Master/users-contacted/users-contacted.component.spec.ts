import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersContactedComponent } from './users-contacted.component';

describe('UsersContactedComponent', () => {
  let component: UsersContactedComponent;
  let fixture: ComponentFixture<UsersContactedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersContactedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersContactedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
