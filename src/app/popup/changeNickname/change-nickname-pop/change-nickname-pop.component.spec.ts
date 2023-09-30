import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNicknamePopComponent } from './change-nickname-pop.component';

describe('ChangeNicknamePopComponent', () => {
  let component: ChangeNicknamePopComponent;
  let fixture: ComponentFixture<ChangeNicknamePopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeNicknamePopComponent]
    });
    fixture = TestBed.createComponent(ChangeNicknamePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
