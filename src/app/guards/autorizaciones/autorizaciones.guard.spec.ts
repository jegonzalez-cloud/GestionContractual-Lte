import { TestBed } from '@angular/core/testing';

import { AutorizacionesGuard } from './autorizaciones.guard';

describe('AutorizacionesGuard', () => {
  let guard: AutorizacionesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutorizacionesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
