import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcUaComponent } from './opc-ua.component';

describe('OpcUaComponent', () => {
  let component: OpcUaComponent;
  let fixture: ComponentFixture<OpcUaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcUaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcUaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
