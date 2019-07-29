import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '@app/services/shared/app.service';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/services/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {
  systemSettingModel: any;
  deviceSettingsModel: any;
  constructor(private http: HttpClient, private appService: AppService, private auth: AuthService) {
    this.systemSettingModel = [];
    this.systemSettingModel = [
      {
        displayName: 'Frequency update of PV and diagnostic data in dashboard', parameterKey: 'dashboardUpdateFrequency', validators: [{ type: 'required', typeOptions: null, message: 'field cannot be empty' },
        { type: 'format', typeOptions: 'unsignedInt', message: `value should be in number format` },
        { type: 'range', typeOptions: { dataType: 'unsignedInt', minimum: 60, maximum: 3000 }, message: `Input should be between 60 t0 3000 seconds.` }]
      }
    ];
    this.deviceSettingsModel = {
      scanFrequency: {
        displayName: 'Automatic scan Frequency for device change', parameterKey: 'scanFrequency', validators: [{ type: 'required', typeOptions: null, message: 'field cannot be empty' },
        { type: 'format', typeOptions: 'unsignedInt', message: `value should be in number format` },
        { type: 'range', typeOptions: { dataType: 'unsignedInt', minimum: 300, maximum: 86400 }, message: `Input should be between 300 t0 86400  seconds.` }]
      }
    };
  }

  updateSystemSettings(intervalData) {
    return this.http.post<any>(`${this.appService.configServicesUrl}systemSettings/updateSystemSettings`, intervalData)
      .pipe(map(data => {
        return data;
      }));
  }
  updateModbusSettings(modbusData) {
    return this.http.post<any>(`${this.appService.configServicesUrl}rs485/changeBaudrate`, modbusData)
      .pipe(map(data => {
        return data;
      }));
  }
  getSystemSettings() {
    return this.http.get<any>(`${this.appService.configServicesUrl}systemSettings/getSystemSettings`);
  }
  getScanFrequency() {
    return this.http.get<any>(`${this.appService.deviceServicesUrl}device/getAutoScanInterval`);
  }
  setScanFrequency(scanInterval: number) {
    return this.http.post<any>(`${this.appService.configServicesUrl}device/changeAutoScanInterval?interval=${scanInterval}`, { responseType: 'json' })
      .pipe(map(data => {
        return data;
      }));
  }
  getRs485Parameters() {
    return this.http.get<any>(`${this.appService.configServicesUrl}rs485/getRs485Parameters`);
  }
  getSettingValueByKey(key) {
    const input = { parameterKey: key };
    const headerToBeSend = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.appService.configServicesUrl}systemSettings/getSettingValueByKey`, { headers: headerToBeSend, params: input })
      .pipe(map(result => {
        return result;
      }));
  }
  get isAdmin() {
    return this.auth.isAdmin;
  }
}
