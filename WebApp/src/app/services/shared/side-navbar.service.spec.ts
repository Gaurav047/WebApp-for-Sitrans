import { TestBed, inject } from '@angular/core/testing';

import { SideNavbarService } from './side-navbar.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('SideNavbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule, RouterTestingModule],
      providers: [SideNavbarService]
    });
  });

  it('should be created', inject([SideNavbarService], (service: SideNavbarService) => {
    expect(service).toBeTruthy();
  }));
});
