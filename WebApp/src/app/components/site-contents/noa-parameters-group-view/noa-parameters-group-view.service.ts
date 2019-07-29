import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeviceDataService } from '@app/services/shared/device-data.service';
import { AuthService } from '@app/services/shared/auth.service';
import { AppService } from '@app/services/shared/app.service';

@Injectable({
  providedIn: 'root'
})
export class NoaParametersGroupViewService {

  constructor(private http: HttpClient, private deviceDataService: DeviceDataService, protected auth: AuthService, public appService: AppService) { }
  getNoaGroupItems(deviceTypeID: string, deviceRevision: number, manufacturerId: number, groupItem: string) {
    return this.http.get<any>(`${this.appService.eddParserUrl}api/v1/getRootGroupingList?deviceType=${deviceTypeID}&deviceRevision=${deviceRevision}&manufacturerId=${manufacturerId}&groupItem=${groupItem}`);
  }
  getCommandsBasedOnParams(parameter: string, deviceTypeID: string, deviceRevision: number, manufacturerId: number, ) {
    return this.http.get(`${this.appService.eddParserUrl}api/v1/getCommand?deviceType=${deviceTypeID}&deviceRevision=${deviceRevision}&manufacturerId=${manufacturerId}&parameter=${parameter}`);
  }
  getCommandResponse(shieldNumber: number, channelNumber: number, command: number, transaction: number) {
    return this.http.post(`${this.deviceDataService.cmdUrl}shield=${shieldNumber}&channel=${channelNumber}&command=${command}&transaction=${transaction}`, { observe: 'response' });
  }
}
