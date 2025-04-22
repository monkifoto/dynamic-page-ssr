import { TestBed } from '@angular/core/testing';

import { ThemeInitializerService } from './theme-initializer.service';

describe('ThemeInitializerService', () => {
  let service: ThemeInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
