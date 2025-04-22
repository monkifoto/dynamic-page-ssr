import { TestBed } from '@angular/core/testing';

import { WebContentService } from './web-content.service';

describe('WebContentService', () => {
  let service: WebContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
