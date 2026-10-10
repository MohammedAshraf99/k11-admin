import { TestBed } from '@angular/core/testing';

import { PromoBannerService } from './promo-banner.service';

describe('PromoBannerService', () => {
  let service: PromoBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromoBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
