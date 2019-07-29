import { TestBed } from '@angular/core/testing';

import { ParameterConfigurationService } from './parameter-configuration.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppService } from '@app/services/shared/app.service';
import { ShieldChannelAccessService } from '@app/services/config-services/shield-channel-access.service';

describe('ParameterConfigurationService', () => {
 // let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let parameterConfigurationService: ParameterConfigurationService;
  let appService: AppService;
  let shieldChannelAccessService: ShieldChannelAccessService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule, HttpClientTestingModule],
    providers: [ ParameterConfigurationService, ShieldChannelAccessService]
  }));
  beforeEach(() => {
   // httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    parameterConfigurationService = TestBed.get(ParameterConfigurationService);
    appService = TestBed.get(AppService);
    shieldChannelAccessService = TestBed.get(ShieldChannelAccessService);
  });

  it('should be created', () => {
    const service: ParameterConfigurationService = TestBed.get(ParameterConfigurationService);
    expect(service).toBeTruthy();
  });


  it('getShieldNameDetails() should http GET response', () => {
    const response = [{ shieldId: 1, shieldName: 'Mechanical Room', isActive: 0 },
    { shieldId: 2, shieldName: 'Mock Shield 2', isActive: 0 },
    { shieldId: 3, shieldName: 'Electrical Room', isActive: 0 },
    { shieldId: 4, shieldName: 'Mechanical Room', isActive: 0 },
    { shieldId: 5, shieldName: 'Mechanical Room', isActive: 1 },
    { shieldId: 6, shieldName: 'Chemical Room', isActive: 0 },
    { shieldId: 7, shieldName: 'Connected shield 7', isActive: 0 },
    { shieldId: 8, shieldName: 'Connected shield name 8', isActive: 0 }];
    shieldChannelAccessService.getShieldNameDetails().subscribe((res) => {
      expect(res).toEqual(response);
    });
    expect(parameterConfigurationService).toBeTruthy();
  });
  it('getConnectedShieldNames() check', () => {
    const service: ParameterConfigurationService = TestBed.get(ParameterConfigurationService);
    expect(service.getConnectedShieldNames).toBeTruthy();
  });
  it('getConfigurationData() should http GET response', () => {
    const response = { data: ' ' };
    const dataLoggerConfig = 'dataLogger';

    parameterConfigurationService.getConfigurationData(dataLoggerConfig).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}${dataLoggerConfig}/getConfigData`);
    expect(reqest.request.method).toEqual('GET');
    reqest.flush(response);

    httpTestingController.verify();
  });
  it('getFrequencyData() should http GET response', () => {
    const response = { data: ' ' };
    const dataLoggerConfig = 'dataLogger';

    parameterConfigurationService.getFrequencyData(dataLoggerConfig).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}${dataLoggerConfig}/getFrequency`);
    expect(reqest.request.method).toEqual('GET');
    reqest.flush(response);

    httpTestingController.verify();
  });



  it('getConnectedShieldNames() check', () => {
    expect(parameterConfigurationService.dataConnstructionForTreeView).toBeTruthy();
  });
  it('saveConfigurationData() check', () => {
    expect(parameterConfigurationService.saveConfigurationData).toBeTruthy();
  });
  it('getMindConnectKeyData() should http GET response', () => {
    const response = { data: ' ' };
    const dataLoggerConfig = 'dataLogger';

    parameterConfigurationService.getMindConnectKeyData(dataLoggerConfig).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(appService.configServicesUrl + dataLoggerConfig + '/getOnboardingKey');
    expect(reqest.request.method).toEqual('GET');
    reqest.flush(response);

    httpTestingController.verify();
  });
  it('getMindConnectKeyData() should http GET response', () => {
    const configKeyData = '';
    const dataType = { 'onBoardingKey': configKeyData };
    const mindConnectConfig = 'mindConnect';
    parameterConfigurationService.saveMindConnectKeyData(mindConnectConfig, dataType);
    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}${mindConnectConfig}/setOnBoardingKey`);
    expect(reqest.request.method).toEqual('POST');

    httpTestingController.verify();
  });
});
