import { TestBed } from '@angular/core/testing';

import { ProvinceDjangoService } from './province-django.service';

describe('ProvinceDjangoService', () => {
  let service: ProvinceDjangoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvinceDjangoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
