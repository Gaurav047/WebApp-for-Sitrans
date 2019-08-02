import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']

})
export class DashboardComponent implements OnInit {
  mockdata:any;
  cols:any;
  uploadedFiles: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.cols =[{header: 'Serial Number', field:'SerialNo'},
    {header: 'Manufacturer ID', field:'manufacturerId'},
    {header: 'Device type', field:'deviceType'},
    {header: 'Device Revision', field:'deviceRevision'},
    {header: 'Protocol', field:'protocolType'},
    {header: 'File Type', field:'fileType'}
  ]
  this.getdata();

  }
  // to override the mock data 
  getdata(){

    return this.http.get<any>(`http://localhost:3003/api/v1/fileserver/lists`)
      .pipe(map((res: any) => {
 
        return res // returning result to find the dirty bit;
      })).subscribe(res=>{
        this.mockdata = res;
      });
  }
  onUpload(event:any) {
    console.log('inside')
    console.log('event',event);
    for(let file of event.files) {
       this.uploadedFiles.push(file);
        console.log(this.uploadedFiles);
    }
  }
  downloadFile(manufacturerId,deviceType,deviceRevision,protocolType,fileType){
    console.log('inside download')
    console.log(protocolType)
    return this.http.get(`http://localhost:3003/load/api/v1/fileserver?manufacturerId=${manufacturerId}&deviceType=${deviceType}&deviceRevision=${deviceRevision}&protocolType=${protocolType}&fileType=${fileType}` ,{responseType: "blob",headers: new HttpHeaders().append("Content-Type", "application/json")}).subscribe(res=>{
      console.log('res',res)
      saveAs(res, '123.txt');
    });
  }
}

//http://localhost:3003/load/api/v1/fileserver?manufacturerId=${manufacturerId}&deviceType=${deviceType}&deviceRevision=${deviceRevision}&protocolType=${protocolType}&fileType=${fileType}
//localhost:3003/load/api/v1/fileserver?manufacturerId=32&deviceType=43&deviceRevision=1&protocolType=HART&fileType=json

