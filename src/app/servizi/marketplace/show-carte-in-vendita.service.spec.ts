import { TestBed } from '@angular/core/testing';

import { ShowCarteInVenditaService } from './show-carte-in-vendita.service';

describe('ShowCarteInVenditaService', () => {
  let service: ShowCarteInVenditaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowCarteInVenditaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
