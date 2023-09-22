import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaFaiOffertaComponent } from './pagina-fai-offerta.component';

describe('PaginaFaiOffertaComponent', () => {
  let component: PaginaFaiOffertaComponent;
  let fixture: ComponentFixture<PaginaFaiOffertaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaFaiOffertaComponent]
    });
    fixture = TestBed.createComponent(PaginaFaiOffertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
