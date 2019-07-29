import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MindConnectComponent } from './mind-connect.component';
import { HttpClient } from '@angular/common/http';
import { ParameterConfigurationComponent } from '../../shared/parameter-configuration/parameter-configuration.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TreeTableModule } from 'primeng/treetable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppService } from '@app/services/shared/app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { RouterTestingModule } from '@angular/router/testing';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';

describe('MindConnectComponent test Suite:', () => {
  let component: MindConnectComponent;
  let fixture: ComponentFixture<MindConnectComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let parameterConfigurationComponent: ParameterConfigurationComponent;
  let appService: AppService;
  let parameterConfigurationService: ParameterConfigurationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MindConnectComponent, ParameterConfigurationComponent],
      imports: [HttpClientTestingModule, TreeTableModule, RouterTestingModule],
      providers: [MindConnectComponent, HttpClient, ParameterConfigurationComponent, AppService, MessageService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MindConnectComponent);
    component = fixture.componentInstance;
    parameterConfigurationService = TestBed.get(ParameterConfigurationService);
    fixture.detectChanges();
  });
  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    parameterConfigurationComponent = TestBed.get(ParameterConfigurationComponent);
    appService = TestBed.get(AppService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('parameterConfigurationService.getConfigurationData() should http GET response', () => {
    const mindConnectData = [{ shield: 1, channel: 0, parameter: 'ChannelActive', isSelected: 0, frequency: 900 }];
    const mindConnectConfig = 'mindConnect';
    component.getConfigData();
    parameterConfigurationService.getConfigurationData(mindConnectConfig).subscribe((res) => {
      expect(res).toEqual(mindConnectData);
      parameterConfigurationService.dataConnstructionForTreeView(res);
    });
    expect(component.getConfigData).toBeTruthy();
  });
  it('getConfigData function check', () => {
    expect(component.getConfigData).toBeTruthy();
  });
  it('parameterConfigurationService.getFrequencyData() should http GET response', () => {
    const mindConnectData = {};
    const mindConnectConfig = 'mindConnect';
    component.getConfigData();
    parameterConfigurationService.getFrequencyData(mindConnectConfig).subscribe((res) => {
      expect(res).toEqual(mindConnectData);
    });
    expect(component.getFrequencyData).toBeTruthy();
  });
  it('getFrequencyData function check', () => {
    expect(component.getFrequencyData).toBeTruthy();
  });
  it('cancelConfig function check', () => {
    expect(component.cancelConfig).toBeTruthy();
  });
  // it('disableStatus function check', () => {
  //   expect(component.disableStatus).toBeTruthy();
  // });
  it('getFrequencyData function check', () => {
    expect(component.commonFrequency).toBeTruthy();
  });
});
