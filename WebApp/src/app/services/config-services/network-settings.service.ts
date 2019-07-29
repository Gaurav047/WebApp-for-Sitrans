import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import 'rxjs';
import { AppService } from '@app/services/shared/app.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkSettingsService {
  fileDataUrl;
  rebootUrl;

  constructor(private http: HttpClient, private appService: AppService) {
  }
  // api for get interface file
  getFullFileData() {
    this.fileDataUrl = this.appService.configServicesUrl + 'networksetting/getInterfaceFile';
    return this.http.get<any>(this.fileDataUrl)
      .pipe(map(fileData => {
        return fileData;
      }));
  }
  // api for reboot device
  getReboot() {
    this.rebootUrl = this.appService.configServicesUrl + 'networksetting/reboot';
    return this.http.get<any>(this.rebootUrl)
      .pipe(map(reboot => {
        return reboot;
      }));
  }
  // function for disable input field
  fieldDisable(formName, firstFieldName, seconFieldName) {
    const ipAddress = formName.get(firstFieldName);
    ipAddress.disable();
    const netmask = formName.get(seconFieldName);
    netmask.disable();
  }
  // function for enable input field
  fieldEnable(formName, firstFieldName, seconFieldName) {
    const ipAddress = formName.get(firstFieldName);
    ipAddress.enable();
    const netmask = formName.get(seconFieldName);
    netmask.enable();
  }
}
