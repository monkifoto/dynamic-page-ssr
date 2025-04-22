import { TestBed } from '@angular/core/testing';

import { BusinessSectionsService } from './business-sections.service';

describe('BusinessSectionsService', () => {
  let service: BusinessSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
