import { Injectable } from '@angular/core';
import { GridProperties } from '@app/model/gridProperties';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppService } from '@app/services/shared/app.service';
@Injectable({
  providedIn: 'root'
})
export class ConfigGridService {
  private _shieldChannelStatusGridData: GridProperties;
  private _opcUAGridData: GridProperties;
  private _mindConnectGridData: GridProperties;
  private _dataLoggerGridData: GridProperties;
  public tabChangeEvent = new Subject<any>();
  shieldChannelData = [];

  constructor(private http: HttpClient, private appService: AppService) {
    // const data = this.dataloggerService.getTreeValue();
    // const shieldData = {
    //   'data': data
    // };
    // this._dataLoggerGridData = {
    //   cols: [{ field: 'name', header: 'Name' },
    //   { field: 'isactive', header: 'Status' }],

    //   isTreeView: true,
    //   gridData: shieldData
    // };

    // --------------------------------------------------------------------------------------
    // const channelList = [];
    // const availableShields = [1, 2];
    // this.shieldChannelData = [];
    // for (let channel = 1; channel <= 5; channel++) {
    //   const enableData = {
    //     'data': {
    //       'name': 'Channel' + channel,
    //       'isactive': false
    //     }
    //   };
    //   channelList.push(enableData);
    // }
    // availableShields.forEach((shield) => {
    //   const shieldData1 = {
    //     'data': {
    //       'name': 'Shield' + shield,
    //       'isactive': false
    //     },
    //     'children': channelList
    //   };
    //   this.shieldChannelData.push(shieldData1);
    // });
    // const enableDataView = {
    //   'data': this.shieldChannelData
    // };
    // this._shieldChannelStatusGridData = {
    //   cols: [{ field: 'name', header: 'Name' },
    //   { field: 'isactive', header: 'Status' }],

    //   isTreeView: true,
    //   gridData: enableDataView
    // };
  }

  set shieldChannelStatusGridData(griddata: GridProperties) {
    this._shieldChannelStatusGridData = griddata;
  }
  get shieldChannelStatusGridData() {
    return this._shieldChannelStatusGridData;
  }
  set opcUAGridData(griddata: GridProperties) {
    this._opcUAGridData = griddata;
  }
  get opcUAGridData() {
    return this._opcUAGridData;
  }
  set mindConnectGridData(griddata: GridProperties) {
    this._mindConnectGridData = griddata;
  }
  get mindConnectGridData() {
    return this._mindConnectGridData;
  }
  set dataLoggerGridData(griddata: GridProperties) {
    this._dataLoggerGridData = griddata;
  }
  get dataLoggerGridData() {
    return this._dataLoggerGridData;
  }
  updateShieldChannelAvailability(shieldChannelInfo) {
    return this.http.post<any>(`${this.appService.nodeUrl}shieldChannel/updateShieldChannelAvailability`, shieldChannelInfo)
      .pipe(map(data => {
        return data;
      }));
  }
  getShieldChannelAvailability() {
    return this.http.get<any>(`${this.appService.nodeUrl}shieldChannel/getShieldChannelAvailability`);
  }
}
