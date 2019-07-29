import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterConfigurationComponent } from './parameter-configuration.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { TreeTableModule } from 'primeng/primeng';
import { MatSlideToggleModule, MatSlideToggleBase } from '@angular/material/slide-toggle';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParameterConfigurationComponent', () => {
  let component: ParameterConfigurationComponent;
  let fixture: ComponentFixture<ParameterConfigurationComponent>;
  class GetNetworkSettingsServiceStub {

  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterConfigurationComponent, DropdownComponent],
      imports: [TreeTableModule, MatSlideToggleModule, HttpClientModule, RouterTestingModule],
      providers: [{provide: MatSlideToggleBase}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('displayFrequencyLabel Function', () => {
    const value = { label: 10 + ' min', value: 600 };
    expect(component.displayFrequencyLabel(600)).toEqual(value);
    expect(component.displayFrequencyLabel).toBeTruthy();
  });
  it('toggleDisplay Function', () => {
    const rowNode = 'Electrical Room';
    expect(component.toggleDisplay(rowNode)).toEqual(true);
    expect(component.toggleDisplay).toBeTruthy();
  });
  it('onChanneltoggle function', () => {
    expect(component.onChanneltoggle).toBeTruthy();
  });
  it('onParamToggle function', () => {
    expect(component.onParamToggle).toBeTruthy();
  });
  it('onDropdownChange function', () => {
    expect(component.onDropdownChange).toBeTruthy();
  });
});
