import { TestBed } from '@angular/core/testing';

import { NetworkSettingsService } from './network-settings.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppService } from '@app/services/shared/app.service';

describe('NetworkSettingsService', () => {
 // let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let networkSettingsService: NetworkSettingsService;
  let appService: AppService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule, HttpClientTestingModule],
    providers: [ NetworkSettingsService]
  }));
  beforeEach(() => {
    // httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    networkSettingsService = TestBed.get(NetworkSettingsService);
    appService = TestBed.get(AppService);
  });
  it('should be created', () => {
    expect(networkSettingsService).toBeTruthy();
  });
  it('getFullFileData() should http GET response', () => {
    const response = '# /etc/network/interfaces -- configuration file for ifup(8),ifdown(8) # The loopback interface auto lo iface lo inet loopback # Wired interfaces auto eth0 iface eth0 inet static address 132.186.252.253 netmask 255.255.255.0 auto eth1 iface eth1 inet dhcp';

    networkSettingsService.getFullFileData().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpTestingController.expectOne(appService.configServicesUrl + 'networksetting/getInterfaceFile');
    expect(req.request.method).toEqual('GET');
    req.flush(response);

    httpTestingController.verify();
  });
  it('getReboot() should http GET response', () => {
    const response = { data: 'Reboot Initiated' };

    networkSettingsService.getReboot().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(appService.configServicesUrl + 'networksetting/reboot');
    expect(reqest.request.method).toEqual('GET');
    reqest.flush(response);

    httpTestingController.verify();
  });
  it('FieldEnable function is working', () => {
    expect(networkSettingsService.fieldEnable).toBeTruthy();
  });
  it('FieldDisable function is working', () => {
    expect(networkSettingsService.fieldDisable).toBeTruthy();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
