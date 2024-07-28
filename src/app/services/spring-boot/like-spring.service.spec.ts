import { TestBed } from '@angular/core/testing';

import { LikeSpringService } from './like-spring.service';

describe('LikeSpringService', () => {
  let service: LikeSpringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikeSpringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
