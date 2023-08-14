import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaCarteComponent } from './pagina-carte.component';

describe('PaginaCarteComponent', () => {
  let component: PaginaCarteComponent;
  let fixture: ComponentFixture<PaginaCarteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaCarteComponent]
    });
    fixture = TestBed.createComponent(PaginaCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
