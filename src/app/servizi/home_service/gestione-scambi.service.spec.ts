import { TestBed } from '@angular/core/testing';

import { GestioneScambiService } from './gestione-scambi.service';

describe('GestioneScambiService', () => {
  let service: GestioneScambiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestioneScambiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
