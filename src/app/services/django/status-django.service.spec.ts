import { TestBed } from '@angular/core/testing';

import { StatusDjangoService } from './status-django.service';

describe('StatusDjangoService', () => {
  let service: StatusDjangoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusDjangoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
