import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaListaAmiciComponent } from './pagina-lista-amici.component';

describe('PaginaListaAmiciComponent', () => {
  let component: PaginaListaAmiciComponent;
  let fixture: ComponentFixture<PaginaListaAmiciComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaListaAmiciComponent]
    });
    fixture = TestBed.createComponent(PaginaListaAmiciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
