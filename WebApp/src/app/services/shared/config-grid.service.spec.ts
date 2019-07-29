import { TestBed } from '@angular/core/testing';

import { ConfigGridService } from './config-grid.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfigGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: ConfigGridService = TestBed.get(ConfigGridService);
    expect(service).toBeTruthy();
  });
});
