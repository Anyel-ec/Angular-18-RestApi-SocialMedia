import { TestBed } from '@angular/core/testing';

import { UserSpringService } from './user-spring.service';

describe('UserSpringService', () => {
  let service: UserSpringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSpringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
