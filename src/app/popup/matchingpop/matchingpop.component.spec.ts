import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingpopComponent } from './matchingpop.component';

describe('MatchingpopComponent', () => {
  let component: MatchingpopComponent;
  let fixture: ComponentFixture<MatchingpopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchingpopComponent]
    });
    fixture = TestBed.createComponent(MatchingpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
