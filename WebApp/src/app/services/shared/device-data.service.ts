import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceDataService extends AppService {
  deviceDataUrl: string;
  scanUrl: string;
  pastScanUrl: string;
  cmdUrl: string;
  parsedCmdUrl: string;
  constructor() {
    super();
    this.deviceDataUrl = this.deviceServicesUrl + 'device/';
    this.scanUrl = this.deviceDataUrl + 'scan';
    this.pastScanUrl = this.deviceDataUrl + 'pastScanData';
    this.cmdUrl = this.deviceDataUrl + 'cmd_trigger?';
    this.parsedCmdUrl = this.deviceDataUrl + 'parsedCmd_trigger?';

  }
}
