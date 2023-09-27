import { TestBed } from '@angular/core/testing';

import { MatchmakingServiceService } from './matchmaking-service.service';

describe('MatchmakingServiceService', () => {
  let service: MatchmakingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchmakingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
