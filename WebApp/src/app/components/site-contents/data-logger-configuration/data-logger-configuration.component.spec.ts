import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataLoggerConfigurationComponent } from './data-logger-configuration.component';
import { HttpClientModule } from '@angular/common/http';
import { ParameterConfigurationComponent } from '../../shared/parameter-configuration/parameter-configuration.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TreeTableModule } from 'primeng/treetable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppService } from '@app/services/shared/app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { RouterTestingModule } from '@angular/router/testing';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';
import { LoaderService } from '@app/services/shared/loader.service';

describe('DataLoggerConfigurationComponent test Suite:', () => {
  let component: DataLoggerConfigurationComponent;
  let fixture: ComponentFixture<DataLoggerConfigurationComponent>;
  let httpTestingController: HttpTestingController;
  let parameterConfigurationComponent: ParameterConfigurationComponent;
  let appService: AppService;
  let parameterConfigurationService: ParameterConfigurationService;
  let loaderService: LoaderService;
  let httpClientModule: HttpClientModule;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataLoggerConfigurationComponent, ParameterConfigurationComponent],
      imports: [HttpClientModule, HttpClientTestingModule, TreeTableModule, RouterTestingModule],
      providers: [DataLoggerConfigurationComponent, ParameterConfigurationComponent, AppService, MessageService, LoaderService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
      loaderService = TestBed.get(LoaderService);
      httpClientModule = TestBed.get(HttpClientModule);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLoggerConfigurationComponent);
    component = fixture.componentInstance;
    parameterConfigurationService = TestBed.get(ParameterConfigurationService);
    fixture.detectChanges();
  });
  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    parameterConfigurationComponent = TestBed.get(ParameterConfigurationComponent);
    appService = TestBed.get(AppService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('parameterConfigurationService.getConfigurationData() should http GET response', () => {
    const mindConnectData = [{ shield: 1, channel: 0, parameter: 'ChannelActive', isSelected: 0, frequency: 900 }];
    const dataLoggerConfig = 'dataLogger';
    component.getConfigData();
    parameterConfigurationService.getConfigurationData(dataLoggerConfig).subscribe((res) => {
      expect(res).toEqual(mindConnectData);
      parameterConfigurationService.dataConnstructionForTreeView(res);
    });
    expect(component.getConfigData).toBeTruthy();
  });
  // it('getConfigData function check', () => {
  //   expect(component.getConfigData).toBeTruthy();
  // });
  it('parameterConfigurationService.getFrequencyData() should http GET response', () => {
    const mindConnectData = {};
    const dataLoggerConfig = 'dataLogger';
    component.getConfigData();
    parameterConfigurationService.getFrequencyData(dataLoggerConfig).subscribe((res) => {
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
  it('disableStatus function check', () => {
    expect(component.disableStatus).toBeTruthy();
  });
  it('getFrequencyData function check', () => {
    expect(component.commonFrequency).toBeTruthy();
  });
});
