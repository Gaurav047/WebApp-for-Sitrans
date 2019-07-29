import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/services/shared/app.service';

@Component({
  selector: 'app-opc-ua',
  templateUrl: './opc-ua.component.html',
  styleUrls: ['./opc-ua.component.scss']
})
export class OpcUaComponent implements OnInit {

  opcUaServerInfo: any;
  opcuaIpAddress: any;
  constructor(private appService: AppService) {
    const index = this.appService.coreServiceUrl;
    const startIndex = index.indexOf('://');
    this.opcuaIpAddress = index.substring(startIndex + 3, index.length - 1);
    this.opcUaServerInfo = [{ title: 'OPC-UA Server', value: this.opcuaIpAddress },
    { title: 'OPC-UA Port Number', value: '4840' },
    { title: 'Default UserName', value: 'sitrans' }];

  }

  ngOnInit() {
  }

}
