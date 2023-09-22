import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMazziComponent } from './lista-mazzi.component';

describe('ListaMazziComponent', () => {
  let component: ListaMazziComponent;
  let fixture: ComponentFixture<ListaMazziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaMazziComponent]
    });
    fixture = TestBed.createComponent(ListaMazziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
