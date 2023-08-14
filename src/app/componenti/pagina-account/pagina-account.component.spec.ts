import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAccountComponent } from './pagina-account.component';

describe('PaginaAccountComponent', () => {
  let component: PaginaAccountComponent;
  let fixture: ComponentFixture<PaginaAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaAccountComponent]
    });
    fixture = TestBed.createComponent(PaginaAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
