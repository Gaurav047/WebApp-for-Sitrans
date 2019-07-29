import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppService } from '@app/services/shared/app.service';

@Injectable({
  providedIn: 'root'
})
export class ShieldChannelAccessService {

  constructor(private http: HttpClient, private appService: AppService) { }
  getShieldChannelAccessData() {
    return this.http.get<any>(`${this.appService.configServicesUrl}shieldChannel/getShieldChannelAccessData`);
  }
  updateShieldChannelAccess(shieldChannelInfo) {
    return this.http.post<any>(`${this.appService.configServicesUrl}shieldChannel/updateShieldChannelAccess`, shieldChannelInfo)
      .pipe(map(data => {
        return data;
      }));
  }
  getShieldNameDetails() {
    return this.http.get<any>(`${this.appService.configServicesUrl}shieldChannel/getShieldAccessName`);
  }
  updateShieldName(shieldNameInfo) {
    return this.http.post<any>(`${this.appService.configServicesUrl}shieldChannel/updateShieldName`, shieldNameInfo)
      .pipe(map(data => {
        return data;
      }));
  }

  // getShieldConnection() {
  //   return this.http.get<any>(`${this.appService.nodeUrl}device/scan`);
  // }
}
