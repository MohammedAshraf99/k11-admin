import { TestBed } from '@angular/core/testing';

import { AnnouncmentService } from './announcment.service';

describe('AnnouncmentService', () => {
  let service: AnnouncmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
