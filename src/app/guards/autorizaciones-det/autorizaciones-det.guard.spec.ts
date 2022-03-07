import { TestBed } from '@angular/core/testing';

import { AutorizacionesDetGuard } from './autorizaciones-det.guard';

describe('AutorizacionesDetGuard', () => {
  let guard: AutorizacionesDetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutorizacionesDetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
