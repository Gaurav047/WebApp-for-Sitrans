import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppService } from '@app/services/shared/app.service';
@Injectable({
  providedIn: 'root'
})
export class DataViewerService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getDataViewerLogs(startDate, endDate) {
    let params = new HttpParams();
    params = params.append('startDate', startDate);
    params = params.append('endDate', endDate);
    return this.http.get<any>(`${this.appService.dataLoggerUrl}dataLogger/getDataViewerData`, { params: params });
  }
}
