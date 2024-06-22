import { TestBed } from '@angular/core/testing';

import { UserDjangoService } from './user-django.service';

describe('UserDjangoService', () => {
  let service: UserDjangoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDjangoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
