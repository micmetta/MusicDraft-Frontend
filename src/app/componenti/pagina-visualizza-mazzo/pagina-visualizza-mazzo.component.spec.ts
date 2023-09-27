import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaVisualizzaMazzoComponent } from './pagina-visualizza-mazzo.component';

describe('PaginaVisualizzaMazzoComponent', () => {
  let component: PaginaVisualizzaMazzoComponent;
  let fixture: ComponentFixture<PaginaVisualizzaMazzoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaVisualizzaMazzoComponent]
    });
    fixture = TestBed.createComponent(PaginaVisualizzaMazzoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
