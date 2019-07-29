import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '@app/services/shared/app.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {

  constructor(private http: HttpClient, private appService: AppService) { }

  getTaskStatus() {
    return this.http.get(`${this.appService.taskManagerUrl}taskManager/health`)
      .pipe(map(res => {
        return res;
      }));
  }
  stopService(port: number, serviceId: number) {
    const input = { portNumber: port, serviceId: serviceId };
    return this.http.post<any>(`${this.appService.taskManagerUrl}taskManager/stopService`, input)
      .pipe(map(data => {
        return data;
      }));
  }
  startService(port: number, serviceId: number) {
    const input = { portNumber: port, serviceId: serviceId };
    return this.http.post<any>(`${this.appService.taskManagerUrl}taskManager/startService`, input)
      .pipe(map(data => {
        return data;
      }));
  }
  restartService(port: number, serviceId: number) {
    const input = { portNumber: port, serviceId: serviceId };
    return this.http.post<any>(`${this.appService.taskManagerUrl}taskManager/restartService`, input)
      .pipe(map(data => {
        return data;
      }));
  }
  updateAutostartDetails(data) {
    return this.http.post<any>(`${this.appService.taskManagerUrl}taskManager/updateAutostartDetails`, data)
      .pipe(map(result => {
        return result;
      }));
  }
}
