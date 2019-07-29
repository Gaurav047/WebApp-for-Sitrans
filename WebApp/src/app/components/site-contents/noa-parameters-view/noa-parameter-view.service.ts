import { Injectable } from '@angular/core';
import { DetailedDeviceDataService } from '@app/services/shared/detailed-device-data.service';
import { HttpClient } from '@angular/common/http';
import { DeviceDataService } from '@app/services/shared/device-data.service';
import { AuthService } from '@app/services/shared/auth.service';
import { AppService } from '@app/services/shared/app.service';

@Injectable({
  providedIn: 'root'
})
export class NoaParameterViewService extends DetailedDeviceDataService {

  constructor(private http: HttpClient, private deviceDataService: DeviceDataService, protected auth: AuthService, public appService: AppService) {
    super(auth);
  }
  getCommandDetails(shieldNumber: number, channelNumber: number, commandNumber: number, deviceTypeID: string) {
    return this.http.post(`${this.deviceDataService.parsedCmdUrl}shield=${shieldNumber}&channel=${channelNumber}&command=${commandNumber}&deviceTypeID=${deviceTypeID}`, { responseType: 'text', observe: 'response' });
  }
  getNoaParametersList(shieldNumber: number, channelNumber: number, deviceTypeID: string) {
    return this.http.get(`${this.deviceDataService.deviceDataUrl}getNoaParameters?shield=${shieldNumber}&channel=${channelNumber}&deviceTypeID=${deviceTypeID}`, { responseType: 'text', observe: 'response' });
  }
  getNodeIdsList(deviceTypeID: string, deviceRevision: number, manufacturerId: number, ) {
    return this.http.get(`${this.appService.eddParserUrl}api/v1/getNOAParameterListWithNodeIdBrowseName?deviceType=${deviceTypeID}&deviceRevision=${deviceRevision}&manufacturerId=${manufacturerId}`, { responseType: 'text', observe: 'response' });
  }
  getCommandsBasedOnNodeIds(nodeId: string, deviceTypeID: string, deviceRevision: number, manufacturerId: number, ) {
    return this.http.get(`${this.appService.eddParserUrl}api/v1/getCommand?OPCUAnodeId=${nodeId}&deviceType=${deviceTypeID}&deviceRevision=${deviceRevision}&manufacturerId=${manufacturerId}`);
  }
  getCommandResponse(shieldNumber: number, channelNumber: number, command: number, transaction: number) {
    return this.http.post(`${this.deviceDataService.cmdUrl}shield=${shieldNumber}&channel=${channelNumber}&command=${command}&transaction=${transaction}`, { observe: 'response' });
  }
}



