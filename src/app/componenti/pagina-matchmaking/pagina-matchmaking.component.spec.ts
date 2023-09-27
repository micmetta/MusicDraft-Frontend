import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaMatchmakingComponent } from './pagina-matchmaking.component';

describe('PaginaMatchmakingComponent', () => {
  let component: PaginaMatchmakingComponent;
  let fixture: ComponentFixture<PaginaMatchmakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginaMatchmakingComponent]
    });
    fixture = TestBed.createComponent(PaginaMatchmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
