import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendipopComponent } from './vendipop.component';

describe('VendipopComponent', () => {
  let component: VendipopComponent;
  let fixture: ComponentFixture<VendipopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendipopComponent]
    });
    fixture = TestBed.createComponent(VendipopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
