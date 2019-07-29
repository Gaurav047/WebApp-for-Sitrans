import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaParametersGroupViewComponent } from './noa-parameters-group-view.component';

describe('NoaParametersGroupViewComponent', () => {
  let component: NoaParametersGroupViewComponent;
  let fixture: ComponentFixture<NoaParametersGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoaParametersGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoaParametersGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
