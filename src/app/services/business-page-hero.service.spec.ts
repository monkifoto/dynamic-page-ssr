import { TestBed } from '@angular/core/testing';

import { BusinessPageHeroService } from './business-page-hero.service';

describe('BusinessPageHeroService', () => {
  let service: BusinessPageHeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPageHeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
