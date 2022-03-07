import { TestBed } from '@angular/core/testing';

import { SecopInterceptorService } from './secop-interceptor.service';

describe('SecopInterceptorService', () => {
  let service: SecopInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecopInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
