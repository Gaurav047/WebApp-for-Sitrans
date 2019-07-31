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

    this.cols =[{header: 'Serial Number'},
    {header: 'Manufacturer ID'},
    {header: 'Device type'},
    {header: 'Device Revision'},
    {header: 'Protocol'},
    {header: 'File Type'}

  ]
 this.getdata();

  }
  // to override the mock data 
getdata(){

  return this.http.get<any>(`http://localhost:3003/lists`)
  .pipe(map((res: any) => {
 
    return res // returning result to find the dirty bit;
  })).subscribe(res=>{
this.mockdata = res;
  });
}
}


// ............

  

