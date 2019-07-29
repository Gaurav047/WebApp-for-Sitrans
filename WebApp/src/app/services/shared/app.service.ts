import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public port = 4000;
  public nodeUrl: String;
  public coreServiceUrl: String;
  public healthMonitorUrl: String;
  public deviceServicesUrl: String;
  public configServicesUrl: String;
  public dataLoggerUrl: String;
  public authServicesUrl: String;
  public publisherServicesUrl: String;
  public firmwareUpdateUrl: String;
  public taskManagerUrl: String;
  public eddParserUrl: string;
  public uddManagement: string;

  // Production
  // constructor() {
  //   this.coreServiceUrl = `https://${self.location.host}:`;
  //   this.deviceServicesUrl = this.coreServiceUrl + '5052/';
  //   this.configServicesUrl = this.coreServiceUrl + '5053/';
  //   this.dataLoggerUrl = this.coreServiceUrl + '5054/';
  //   this.authServicesUrl = this.coreServiceUrl + '5055/';
  //   this.publisherServicesUrl = this.coreServiceUrl + '5056/';
  //   this.firmwareUpdateUrl = this.coreServiceUrl + '5057/';
  //   this.taskManagerUrl = this.coreServiceUrl + '5051/';
  //   this.eddParserUrl = this.coreServiceUrl + '5060/';
  // }
  // Local
   constructor() {
     //  this.coreServiceUrl = `http://132.186.252.242:`;
     this.coreServiceUrl = `http://localhost:`;
     this.deviceServicesUrl = this.coreServiceUrl + '5002/';
     this.configServicesUrl = this.coreServiceUrl + '5003/';
     this.dataLoggerUrl = this.coreServiceUrl + '5004/';
     this.authServicesUrl = this.coreServiceUrl + '5005/';
     this.publisherServicesUrl = this.coreServiceUrl + '5006/';
     this.firmwareUpdateUrl = this.coreServiceUrl + '5007/';
     this.taskManagerUrl = this.coreServiceUrl + '5001/';
     this.eddParserUrl = this.coreServiceUrl + '5010/';
     this.uddManagement = this.coreServiceUrl + '3003/';
   }
}
