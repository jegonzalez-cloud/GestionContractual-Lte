import { TestBed } from '@angular/core/testing';

import { BusquedaGuard } from './busqueda.guard';

describe('BusquedaGuard', () => {
  let guard: BusquedaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BusquedaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
