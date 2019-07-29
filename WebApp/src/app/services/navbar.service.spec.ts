import { TestBed } from '@angular/core/testing';

import { NavbarService } from './navbar.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: NavbarService = TestBed.get(NavbarService);
    expect(service).toBeTruthy();
  });
});