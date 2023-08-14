import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuaConGoogleComponent } from './continua-con-google.component';

describe('ContinuaConGoogleComponent', () => {
  let component: ContinuaConGoogleComponent;
  let fixture: ComponentFixture<ContinuaConGoogleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContinuaConGoogleComponent]
    });
    fixture = TestBed.createComponent(ContinuaConGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
