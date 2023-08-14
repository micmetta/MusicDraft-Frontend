import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaMarketplaceComponent } from './pagina-marketplace.component';

describe('PaginaMarketplaceComponent', () => {
  let component: PaginaMarketplaceComponent;
  let fixture: ComponentFixture<PaginaMarketplaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaMarketplaceComponent]
    });
    fixture = TestBed.createComponent(PaginaMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
