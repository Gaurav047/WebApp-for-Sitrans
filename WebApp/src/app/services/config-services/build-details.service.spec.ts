import { TestBed } from '@angular/core/testing';
import { BuildDetailsService } from './build-details.service';
describe('BuildDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildDetailsService = TestBed.get(BuildDetailsService);
    expect(service).toBeTruthy();
  });
});
