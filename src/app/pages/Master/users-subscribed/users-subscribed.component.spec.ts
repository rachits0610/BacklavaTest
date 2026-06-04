import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSubscribedComponent } from './users-subscribed.component';

describe('UsersSubscribedComponent', () => {
  let component: UsersSubscribedComponent;
  let fixture: ComponentFixture<UsersSubscribedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSubscribedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
