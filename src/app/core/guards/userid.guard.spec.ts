import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { useridGuard } from './userid.guard';

describe('useridGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => useridGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
