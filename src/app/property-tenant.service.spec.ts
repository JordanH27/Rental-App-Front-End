import { TestBed } from '@angular/core/testing';

import { PropertyTenantService } from './property-tenant.service';

describe('PropertyTenantService', () => {
  let service: PropertyTenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyTenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
