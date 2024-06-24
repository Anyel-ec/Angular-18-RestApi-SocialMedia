import { TestBed } from '@angular/core/testing';

import { CategoryDjangoService } from './category-django.service';

describe('CategoryDjangoService', () => {
  let service: CategoryDjangoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryDjangoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
