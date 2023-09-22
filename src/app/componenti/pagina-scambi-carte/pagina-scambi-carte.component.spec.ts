import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaScambiCarteComponent } from './pagina-scambi-carte.component';

describe('PaginaScambiCarteComponent', () => {
  let component: PaginaScambiCarteComponent;
  let fixture: ComponentFixture<PaginaScambiCarteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaScambiCarteComponent]
    });
    fixture = TestBed.createComponent(PaginaScambiCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
