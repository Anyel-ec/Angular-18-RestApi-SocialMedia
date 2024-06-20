import { TestBed } from '@angular/core/testing';

import { CommentSpringService } from './comment-spring.service';

describe('CommentSpringService', () => {
  let service: CommentSpringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentSpringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
