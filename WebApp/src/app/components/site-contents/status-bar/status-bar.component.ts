import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SitransListviewService } from '../sitrans-listview/sitrans-listview.service';
import { StatusBarService } from './status-bar.service';
import { TaskManagerService } from '../task-manager/task-manager.service';
@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
  statusTools: any;
  deviceCount: number;
  diagnosticsStatusData: any;
  taskManagerList: any;
  @ViewChild('tileSection') tileviewRef: ElementRef;
  constructor(public sitransGridService: SitransListviewService, private statusBarService: StatusBarService, private taskManagerService: TaskManagerService) { }
  // on init
  ngOnInit() {
    this.statusTools = [
      { img: '../../../../assets/images/NODE JS.png', imgText: 'Node Js' },
      { img: '../../../../assets/images/MIND CONNECT.png', imgText: 'Mind Connect' },
      { img: '../../../../assets/images/WEB APP.png', imgText: 'WebApp' },
      { img: '../../../../assets/images/OPC.png', imgText: 'OPC UA Server' },
      { img: '../../../../assets/images/UART.png', imgText: 'UART' },
      { img: '../../../../assets/images/MODBUS.png', imgText: 'Modbus' },
    ];
    this.diagnosticsStatusData = [{
      statusTxt: 'Good',
      value: 0,
      color: '#30A830',
      tileClass: 'firstTile',
      msg: 'Click to filter by Good'
    },
    {
      statusTxt: 'Maintenance Required',
      value: 1,
      color: '#50bed7',
      tileClass: 'secondTile',
      msg: 'Click to filter by Maintenance Required'
    },
    {
      statusTxt: 'Failure',
      value: 8,
      color: '#ec3041',
      tileClass: 'thirdTile',
      msg: 'Click to filter by Failure'
    },
    {
      statusTxt: 'Out Of Specification',
      value: 10,
      color: '#ffb900',
      tileClass: 'forthTile',
      msg: 'Click to filter by Out Of Specification'
    },
    {
      statusTxt: 'Function Check',
      value: 20,
      color: '#eb780a',
      tileClass: 'fifthTile',
      msg: 'Click to filter by Out Of Function Check'
    }];
    this.taskManagerList = [{
      serviceId: 1005, name: 'Device Services', img: '../../../../assets/images/device services.png', link: '../config/taskManager',
      msg: 'Click to go Device Services', isActive: null
    },
    {
      serviceId: 1001, name: 'Configuration Services', img: '../../../../assets/images/Configuration-Services.png', link: '../config/taskManager',
      msg: 'Click to go Device Services', isActive: null
    },
    {
      serviceId: 1003, name: 'Field Communication Services', img: '../../../../assets/images/device services.png', link: '../config/taskManager',
      msg: 'Click to go Modbus Services', isActive: null
    },
    {
      serviceId: 1004, name: 'OPC UA Server', img: '../../../../assets/images/OPC UA server.png', link: '../config/opcUa',
      msg: 'Click to go OPC UA Server', isActive: null
    },
      // {
      //   name: 'Mind Connect', img: '../../../../assets/images/MIND CONNECT.png', link: '../config/taskManager',
      //   msg: 'Click to go Mind Connect'
      // },
      // {
      //   name: 'Data Logger', isActive: false, img: '../../../../assets/images/Datalogger.png', link: '../config/taskManager',
      //   msg: 'Click to go Data Logger'
      // },
      // { name: 'Node-Red', isActive: false, img: '../../../../assets/images/Node-red.png' }
    ];
    this.getTaskStatus();
  }
  formTaskListWithStatus(taskStatus) {
    if (taskStatus !== undefined && taskStatus.length !== 0) {
      taskStatus.forEach(task => {
        const taskIndex = this.taskManagerList.findIndex(x => x.serviceId === task.serviceId);
        if (taskIndex > -1) {
          this.taskManagerList[taskIndex].isActive = task.status === 'Good' ? true : false;
        }
      });
    } else {
      // when task manager api returns error /null data;
    }
  }
  getTaskStatus() {
    this.taskManagerService.getTaskStatus().subscribe((taskStatus: any) => {
      if (taskStatus !== undefined) {
        this.formTaskListWithStatus(taskStatus);
      }
    }, (err) => {
      return err;
    });
  }
  onTileSelection(event) {
    if (event === 'NONE') {
      // non clear filter reset the grid view
      this.statusBarService.detectDiagnosticStateTileClick('101');
    }
    if (this.tileviewRef.nativeElement.querySelectorAll('.onTileSelection').length > 0) {
      // on click of a tile, remove the highlight from the previous tiles
      this.tileviewRef.nativeElement.querySelectorAll('.onTileSelection').forEach(element => {
        element.classList.remove('onTileSelection');
      });
    }

  }
  getScanData() {
    if (this.sitransGridService.hasMaximumScanExceeded === false) {
      this.statusBarService.detectDiagnosticStateTileClick('101');
      this.sitransGridService.populateSitransList(false);
      this.sitransGridService.sitransGridList = this.sitransGridService.sitransList;
    } else {
      return;
    }

  }
}
