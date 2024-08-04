import { TestBed } from '@angular/core/testing';

import { GenderDjangoService } from './gender-django.service';

describe('GenderDjangoService', () => {
  let service: GenderDjangoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenderDjangoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
