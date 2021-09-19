import { TestBed } from '@angular/core/testing';

import { ProcesosGuard } from './procesos.guard';

describe('ProcesosGuard', () => {
  let guard: ProcesosGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProcesosGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
