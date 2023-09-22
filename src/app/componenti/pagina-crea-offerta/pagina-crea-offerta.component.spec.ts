import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaCreaOffertaComponent } from './pagina-crea-offerta.component';

describe('PaginaCreaOffertaComponent', () => {
  let component: PaginaCreaOffertaComponent;
  let fixture: ComponentFixture<PaginaCreaOffertaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaCreaOffertaComponent]
    });
    fixture = TestBed.createComponent(PaginaCreaOffertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
