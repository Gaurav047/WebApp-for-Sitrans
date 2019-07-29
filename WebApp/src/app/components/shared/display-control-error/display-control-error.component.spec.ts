import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayControlErrorComponent } from './display-control-error.component';
import { MustMatch } from './display-control-error.component';

describe('DisplayControlErrorComponent', () => {
  let component: DisplayControlErrorComponent;
  let fixture: ComponentFixture<DisplayControlErrorComponent>;
  let mustMatch;
  class MustMatchStrub {

  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayControlErrorComponent],
      providers: [{ provide: MustMatch, useClass: MustMatchStrub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayControlErrorComponent);
    component = fixture.componentInstance;
    mustMatch = TestBed.get(MustMatch);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('mustMatch working', () => {
    expect(mustMatch).toBeTruthy();
  });
});
