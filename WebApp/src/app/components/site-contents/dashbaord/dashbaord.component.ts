import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  mockdata:any;
  cols:any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.mockdata = [{manufacturerId:34,deviceType:43,deviceRevision:1,protocol:'HART',fileType:'json'},
    {manufacturerId:36,deviceType:45,deviceRevision:3,protocol:'MODBUS',fileType:'xml'}];

    this.cols =[{header: 'Manufacturer ID',field: 'manufacturerId'},
    {header: 'Device Type',field: 'deviceType'},
    {header: 'Device Revision',field: 'deviceRevision'},
    {header: 'Protocol',field: 'protocol'},
    {header: 'File Type',field: 'fileType'}

  ]
// this.getdata();

  }
  // to override the mock data 
getdata(){

  return this.http.get<any>(`http://yourIp:portnumber/user/usersdetail`)
  .pipe(map((res: any) => {
 
    return res // returning result to find the dirty bit;
  })).subscribe(res=>{
this.mockdata = res;
  });
}
}
