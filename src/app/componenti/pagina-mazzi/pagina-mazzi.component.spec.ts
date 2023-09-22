import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaMazziComponent } from './pagina-mazzi.component';

describe('PaginaMazziComponent', () => {
  let component: PaginaMazziComponent;
  let fixture: ComponentFixture<PaginaMazziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaMazziComponent]
    });
    fixture = TestBed.createComponent(PaginaMazziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
