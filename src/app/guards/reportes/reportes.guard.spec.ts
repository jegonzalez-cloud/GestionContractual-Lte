import { TestBed } from '@angular/core/testing';

import { ReportesGuard } from './reportes.guard';

describe('ReportesGuard', () => {
  let guard: ReportesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReportesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
