import { Component, OnInit, OnDestroy } from '@angular/core';
import { SitransListviewService } from './sitrans-listview.service';
import { SideNavbarService } from '@app/services/shared/side-navbar.service';
import { StatusBarService } from '../status-bar/status-bar.service';
import { environment } from '@env/environment';
import { SystemSettingsService } from '../system-settings/system-settings.service';

@Component({
  selector: 'app-sitrans-listview',
  templateUrl: './sitrans-listview.component.html',
  styleUrls: ['./sitrans-listview.component.scss']
})
export class SitransListviewComponent implements OnInit, OnDestroy {

  constructor(public sitransgridService: SitransListviewService, private sideNavService: SideNavbarService, private statusBarService: StatusBarService, private systemSetting: SystemSettingsService) { }
  cols: any;
  paramstoDetailView: any;
  sitransList: any = [];
  intervalSubscription: any;
  refreshInterval: any;
  cmdList: any;
  ngOnInit() {
    this.sitransgridService.populateSitransList(true);
    this.sitransgridService.sitransGridList = this.sitransgridService.sitransList;
    // filter  grid on click of the diagnostic state tiles in the dashboard.
    this.statusBarService.getDiagnosticStateChange$.forEach((event) => {
      if (event === '101') {
        this.sitransgridService.sitransGridList = this.sitransgridService.sitransList;
      } else if (event !== undefined || event !== null || event !== '') {
        this.sitransgridService.sitransGridList = this.sitransgridService.sitransList.filter((data) => this.sitransgridService.mapDeviceHealthCode(data.statusCode) === event);

      }
    });
    this.cols = [
      { field: 'tag', header: 'Tag', width: '11%' },
      { field: 'measurementType', header: 'MeasurementType', width: '10%' },
      { field: 'manufacturerName', header: 'Manufacturer', width: '10%' },
      { field: 'model', header: 'Model', width: '10%' },
      { field: 'serialNumber', header: 'Serial Number', width: '10%' },
      { field: 'shieldNumber', header: 'MX300 Address', width: '6%' },
      { field: 'displayChannelNumber', header: 'Channel Number', width: '6%' },
      { field: 'pvValue', header: 'PV', width: '10%' },
      { field: 'status', header: 'Status', width: '10%' },
      { field: 'modifiedDate', header: 'Last Modified', width: '8%' },
    ];
    this.cmdList = [{ cmd: 1, input: null }, {
      cmd: 48, input: {
        'DeviceSpecificStatus': 0,
        'ExtendedDeviceStatus': 0,
        'DeviceOperatingMode': 0,
        'StandardizedStatus0': 0,
        'StandardizedStatus1': 0,
        'AnalogChannelSaturated': 0,
        'StandardizedStatus2': 0,
        'StandardizedStatus3': 0,
        'AnalogChannelFixed': 0,
        'DeviceSpecificStatus1': 0
      }
    }];
   // interval for automatically updating the PV value and status
    this.systemSetting.getSettingValueByKey('dashboardUpdateFrequency').subscribe((data) => {
      this.refreshInterval = data !== undefined && data.parameterValue !== undefined ? parseInt(data.parameterValue, 10) : 300;
      this.intervalSubscription = setInterval(() => {
        if (this.sitransgridService.gridProperties.isGridDataLoaded === true) {
          this.sitransgridService.getLatestPVandStatusValues(this.cmdList);
        }
      }, this.refreshInterval * 1000);
    }, (err) => {
      return err;
    });
  }
  callRefreshInAnInterval(interval) {
    // to update PV value and diagnostic state ina n interval;
    this.intervalSubscription = setInterval(() => {
      const cmdList = [{ cmd: 1, input: null }, {
        cmd: 48, input: {
          'DeviceSpecificStatus': 0,
          'ExtendedDeviceStatus': 0,
          'DeviceOperatingMode': 0,
          'StandardizedStatus0': 0,
          'StandardizedStatus1': 0,
          'AnalogChannelSaturated': 0,
          'StandardizedStatus2': 0,
          'StandardizedStatus3': 0,
          'AnalogChannelFixed': 0,
          'DeviceSpecificStatus1': 0
        }
      }];
      this.sitransgridService.getLatestPVandStatusValues(cmdList);
    }, interval * 1000);
  }
  // opening the side bar on click of the first cell in the crow
  openSideNavbar(rowData) {
    this.sideNavService.openDetailViewSideNavBar(true);
    this.paramstoDetailView = { shieldNumber: rowData.shieldNumber, channelNumber: rowData.channelNumber, displayChannelNumber: rowData.displayChannelNumber, status: rowData.status, deviceTypeID: rowData.deviceTypeID, deviceRevision: rowData.deviceRevision, manufacturerId: rowData.manufacturerId, model: rowData.model, serialNumber: rowData.serialNumber };
  }
  reloadPVandStatus(rowData) {
    this.sitransgridService.rowRefreshUpdatePVandStatus(rowData.shieldNumber, rowData.channelNumber, this.cmdList, rowData);
  }
  ngOnDestroy() {
    clearInterval(this.intervalSubscription);
  }
}
