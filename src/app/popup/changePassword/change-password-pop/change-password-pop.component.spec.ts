import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPopComponent } from './change-password-pop.component';

describe('ChangePasswordPopComponent', () => {
  let component: ChangePasswordPopComponent;
  let fixture: ComponentFixture<ChangePasswordPopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordPopComponent]
    });
    fixture = TestBed.createComponent(ChangePasswordPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
