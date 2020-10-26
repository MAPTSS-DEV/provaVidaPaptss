import { TestBed } from '@angular/core/testing';

import { GeraisService } from './gerais.service';

describe('GeraisService', () => {
  let service: GeraisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeraisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
