import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaFaiControffertaComponent } from './pagina-fai-controfferta.component';

describe('PaginaFaiControffertaComponent', () => {
  let component: PaginaFaiControffertaComponent;
  let fixture: ComponentFixture<PaginaFaiControffertaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaFaiControffertaComponent]
    });
    fixture = TestBed.createComponent(PaginaFaiControffertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
