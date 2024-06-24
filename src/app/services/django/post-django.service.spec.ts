import { TestBed } from '@angular/core/testing';

import { PostDjangoService } from './post-django.service';

describe('PostDjangoService', () => {
  let service: PostDjangoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostDjangoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
