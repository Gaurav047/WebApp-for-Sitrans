import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../shared/app.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuildDetailsService {

  constructor(private http: HttpClient, private appService: AppService) { }
  getBuildDetails() {
    return this.http.get(`${this.appService.configServicesUrl}buildDetails/getBuildDetails`)
      .pipe(map(res => {
        return res;
      }));
  }
}
