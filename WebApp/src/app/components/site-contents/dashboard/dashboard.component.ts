import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthGuard } from '@app/services/shared/auth.guard';

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
    {header: 'Protocol', field:'protocol'},
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
}

  

