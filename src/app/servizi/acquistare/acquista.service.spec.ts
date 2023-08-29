import { TestBed } from '@angular/core/testing';

import { AcquistaService } from './acquista.service';

describe('AcquistaService', () => {
  let service: AcquistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcquistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
