import { TestBed } from '@angular/core/testing';

import { Nickname_and_email_user_loggedService } from '././nickname_and_email_user_logged.service';

describe('NicknameAndEmailUserLoggedService', () => {
  let service: Nickname_and_email_user_loggedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nickname_and_email_user_loggedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
