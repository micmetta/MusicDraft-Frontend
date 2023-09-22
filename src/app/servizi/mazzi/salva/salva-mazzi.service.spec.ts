import { TestBed } from '@angular/core/testing';

import { SalvaMazziService } from './salva-mazzi.service';

describe('SalvaMazziService', () => {
  let service: SalvaMazziService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalvaMazziService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
