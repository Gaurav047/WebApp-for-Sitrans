import { TestBed } from '@angular/core/testing';

import { ShieldChannelAccessService } from './shield-channel-access.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppService } from '@app/services/shared/app.service';

describe('ShieldChannelAccessService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;;
  let shieldChannelAccessService: ShieldChannelAccessService
  let appService: AppService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule, HttpClientTestingModule],
    providers: [HttpClient, ShieldChannelAccessService]
  }));
  beforeEach(() => {
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    shieldChannelAccessService = TestBed.get(ShieldChannelAccessService);
    appService = TestBed.get(AppService);
  });

  it('should be created', () => {
    const service: ShieldChannelAccessService = TestBed.get(ShieldChannelAccessService);
    expect(service).toBeTruthy();
  });
  it('getShieldChannelAccessData() should http GET response', () => {
    const response = { data: "" };

    shieldChannelAccessService.getShieldChannelAccessData().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}shieldChannel/getShieldChannelAccessData`);
    expect(reqest.request.method).toEqual("GET");
    reqest.flush(response);

    httpTestingController.verify();
  });
  it('updateShieldChannelAccess() should http Post response', () => {
    const response = { data: "" };
    const shieldChannelInfo = {};

    shieldChannelAccessService.updateShieldChannelAccess(shieldChannelInfo).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}shieldChannel/updateShieldChannelAccess`);
    expect(reqest.request.method).toEqual("POST");
    reqest.flush(response);

    httpTestingController.verify();
  });
  it('getShieldNameDetails() should http GET response', () => {
    const response = { data: "" };

    shieldChannelAccessService.getShieldNameDetails().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}shieldChannel/getShieldAccessName`);
    expect(reqest.request.method).toEqual("GET");
    reqest.flush(response);

    httpTestingController.verify();
  });
  it('updateShieldName() should http Post response', () => {
    const response = { data: "" };
    const shieldNameInfo = {};

    shieldChannelAccessService.updateShieldName(shieldNameInfo).subscribe((res) => {
      expect(res).toEqual(response);
    });

    const reqest = httpTestingController.expectOne(`${appService.configServicesUrl}shieldChannel/updateShieldName`);
    expect(reqest.request.method).toEqual("POST");
    reqest.flush(response);

    httpTestingController.verify();
  });
});
