import { Injectable } from '@angular/core';
import { DetailedDeviceDataService } from '@app/services/shared/detailed-device-data.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDataService } from '@app/services/shared/device-data.service';
import { isEmptyObject } from '@app/utility/commonFunctions';
import { AuthService } from '@app/services/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UniversalCommandViewService extends DetailedDeviceDataService {

  constructor(private http: HttpClient, private deviceDataService: DeviceDataService, protected auth: AuthService) {
    super(auth);
  }

  getCommandDetails(shieldNumber: number, channelNumber: number, commandNumber: number, deviceTypeId: string, inputData?: any) {
    const data = isEmptyObject(inputData) !== true ? inputData : undefined;
    return this.http.post(`${this.deviceDataService.cmdUrl}shield=${shieldNumber}&channel=${channelNumber}&command=${commandNumber}&deviceTypeID=${deviceTypeId}`, data);
  }
  getDataSpec() {
    return this.http.get(`${this.deviceDataService.deviceDataUrl}getDataSpec`);
  }
}
