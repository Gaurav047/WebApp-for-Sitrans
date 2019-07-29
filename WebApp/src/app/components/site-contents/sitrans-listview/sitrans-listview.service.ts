import { Injectable, setTestabilityGetter } from '@angular/core';
import { DeviceDataService } from '@app/services/shared/device-data.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, flatMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { LoaderService } from '@app/services/shared/loader.service';
import { AppService } from '@app/services/shared/app.service';
@Injectable({
  providedIn: 'root'
})
export class SitransListviewService {
  scanData: any;
  modbusShieldStatus: any;
  sitransList: any;
  sitransGridList: any;
  cmdList: any;
  shieldCount = 8;
  deviceData: any;
  diagnosticStateCount: any;
  hasMaximumScanExceeded: boolean;
  pvValueIndex = 3;
  pvUnitsIndex = 2;
  longTagIndex = 2;
  shortTagIndex = 2;
  measurementTypeIndex = 2;
  gridProperties: any;
  constructor(private deviceDataService: DeviceDataService, private http: HttpClient, private loader: LoaderService, private appService: AppService) {
    this.cmdList = [{
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
    }, { cmd: 13, input: null }, { cmd: 20, input: null }, { cmd: 1, input: null }, { cmd: 8, input: null }];
    this.deviceData = { deviceCount: 0 };
    // initializing diagnostic values to zero on load
    this.diagnosticStateCount = { 0: 0, 1: 0, 8: 0, 10: 0, 20: 0 };
    this.hasMaximumScanExceeded = false;
    this.gridProperties = { isGridDataLoaded: false };
  }
  getScanData() {
    const url = this.deviceDataService.scanUrl;
    return this.http.get(url, { observe: 'response' });
  }
  getPastScanData() {
    const url = this.deviceDataService.pastScanUrl;
    return this.http.get(url);
  }
  parseScanData(scanresult: any) {
    const result: any = [];
    scanresult.map(shieldInfo => {
      let obj: any = {};
      if (shieldInfo.shieldStatus === 1) {
        shieldInfo.channelData.map(channelInfo => {
          if (channelInfo.channelStatus === true) {
            obj = {
              shieldNumber: shieldInfo.shield !== undefined ? shieldInfo.shield : '-',
              channelNumber: channelInfo.channel !== undefined ? channelInfo.channel : '-',
              deviceTypeID: channelInfo.deviceType !== undefined ? channelInfo.deviceType : '-',
              deviceRevision: channelInfo.deviceRevision !== undefined ? channelInfo.deviceRevision : '-',
              manufacturerId: channelInfo.manufacturerId !== undefined ? channelInfo.manufacturerId : '-',
              model: channelInfo.deviceTypeName !== undefined ? channelInfo.deviceTypeName : '-',
              manufacturerName: channelInfo.manufacturerName !== undefined ? channelInfo.manufacturerName : '-',
              serialNumber: channelInfo.serialNumber !== undefined ? channelInfo.serialNumber : '-'
            };
            result.push(obj);
          }
        });
      }
    });
    return result;
  }
  getShieldStaus(scanresult: any) {
    const result: any = [];
    scanresult.map(shieldInfo => {
      let obj: any = {};
      if (shieldInfo.shieldStatus === 1) {
        obj = { shieldNumber: shieldInfo.shield, shieldStatus: 1, tooltipText: `Shield ${shieldInfo.shield} is connected` };
      } else if (shieldInfo.shieldStatus === 2) {
        obj = { shieldNumber: shieldInfo.shield, shieldStatus: 2, tooltipText: `Shield ${shieldInfo.shield} is disconnected` };
      } else if (shieldInfo.shieldStatus === 0) {
        obj = { shieldNumber: shieldInfo.shield, shieldStatus: 0, tooltipText: `Shield ${shieldInfo.shield} is disconnected/Abnormal` };
      }
      result.push(obj);
    });
    return result;
  }
  getPvValue(dataBody: any) {
    let pvResult = '-';
    let unitResult = '-';
    let result = '-';
    if (dataBody !== 'error' && dataBody.status === 200 && dataBody.body !== undefined && dataBody.body.response !== undefined) {
      const pvValue: any = Object.values(dataBody.body.response)[this.pvValueIndex];
      pvResult = (pvValue !== undefined ? (pvValue.displayValue !== undefined ? pvValue.displayValue : '-') : '-');
      const unitsValue: any = Object.values(dataBody.body.response)[this.pvUnitsIndex];
      unitResult = (unitsValue !== undefined ? (unitsValue.displayValue !== undefined ? unitsValue.displayValue : '-') : '-');
      if (pvResult !== '-' && unitResult !== '-') {
        result = (pvResult + ' ' + unitResult);
      } else if (pvResult !== '-' && unitResult === '-') {
        result = pvResult;
      } else {
        result = '-';
      }
    } else {
      result = '-';
    }
    return result;
  }
  setTag(longTagResult: any, shortTagResult: any) {
    let result = '';
    if (longTagResult !== 'error' && longTagResult.status === 200 && longTagResult.body !== undefined && longTagResult.body.response !== undefined) {
      const longTagValue: any = Object.values(longTagResult.body.response)[this.longTagIndex];
      result = longTagValue !== undefined && longTagValue.displayValue !== undefined ? longTagValue.displayValue : '-';
    } else if (shortTagResult !== 'error' && shortTagResult.status === 200 && shortTagResult.body !== undefined && shortTagResult.body.response !== undefined) {
      const shortTagValue: any = Object.values(shortTagResult.body.response)[this.shortTagIndex];
      result = shortTagValue !== undefined && shortTagValue.displayValue !== undefined ? shortTagValue.displayValue : '-';
    } else {
      result = 'Tag not set';
    }
    return result;
  }
  // data manupulation on scan/ past scan
  processScanResult(scanresult: any) {
    this.scanData = this.parseScanData(scanresult);
    this.deviceData.deviceCount = this.scanData.length;
    this.modbusShieldStatus = this.getShieldStaus(scanresult);
    if (this.scanData.length <= 0) {
      this.loader.display(false);
    } else {
      this.scanData.forEach(item => {
        this.getGridData(item);
        // to turn off the loader if the data load is complete
        this.checkIfGridDataLoadedCompletely();
      });
    }
  }
  mapDeviceHealthCode(statusCode) {
    if (statusCode === 4) {
      statusCode = 8;
    } else if (statusCode === 2 || statusCode === 40) {
      statusCode = 10;
    }
    return statusCode;
  }
  //  if Error occurs in the scan/past scan
  processScanResultWithError(error: any) {
    this.modbusShieldStatus = [];
    let statusEle = {};
    for (let i = 0; i < this.shieldCount; i++) {
      statusEle = {
        shieldNumber: i + 1,
        shieldStatus: 0,
        tooltipText: `Shield ${i} is disconnected/Re-scan needed`,
      };
      this.modbusShieldStatus.push(statusEle);

    }
    this.loader.display(false);
  }
  // method to initialise the variables required for scan
  initialisationBeforeScan() {
    this.sitransList = [];
    this.diagnosticStateCount = { 0: 0, 1: 0, 8: 0, 10: 0, 20: 0 };
    this.modbusShieldStatus = [];
  }
  populateSitransList(isPastScan: boolean) {
    this.loader.display(true);
    this.gridProperties.isGridDataLoaded = false;
    if (isPastScan === false) {
      this.initialisationBeforeScan();
      this.getScanData().subscribe((scanresult: any) => {
        this.processScanResult(scanresult.body);
      }, (err) => {
        if (err.status === 503) {
          this.hasMaximumScanExceeded = true;
          this.loader.display(false);
          // to turn of max scan exceed error after 5 mins
          setTimeout(() => {
            this.hasMaximumScanExceeded = false;
          }, (30 * 1000));
        } else {
          this.processScanResultWithError(err);
        }
      });
    } else {
      // for populating past scan;
      this.initialisationBeforeScan();
      this.getPastScanData().subscribe((pastScanResult: any) => {
        this.processScanResult(pastScanResult);
      }, (err) => {
        this.processScanResultWithError(err);
      });
    }

  }

  getSitransGridData(shieldNumber, channelNumber, cmdList) {
    // the http get call used to get the channel parameter values
    let api = [];
    api = cmdList.map((x) => {
      return this.http.post(`${this.deviceDataService.cmdUrl}shield=${shieldNumber}&channel=${channelNumber}&command=${x.cmd}`, x.input, { observe: 'response' })
        .pipe(map((res) => res), catchError(e => of(e)));
    });
    return forkJoin(
      api
    );
  }
  decodeDiagnosticStatus(code: number) {
    let result = '';
    switch (code) {
      case 0: result = 'Good';
        break;
      case 1: result = 'Maintenance Required';
        break;
      case 8:
      case 4:
        result = 'Failure';
        break;
      case 10:
      case 2:
      case 40:
        result = 'Out Of Specification';
        break;
      case 20: result = 'Function Check';
        break;
      default: result = 'Undefined Status';
        break;
    }
    return result;
  }
  getDiagnosticStateInfo(data: any) {
    let result = -1;
    if (data !== 'error ' && data.status === 200 && data.body.response !== undefined) {
      const diagnosticStateResponse: any = data.body.response['noaStatus'];
      const diagnosticStateResult: number = diagnosticStateResponse !== undefined ? diagnosticStateResponse : -1;
      result = diagnosticStateResult;
    } else {
      result = -1;
    }
    return result;
  }
  getMeasurementType(data) {
    let result = '-';
    if (data !== 'error ' && data.status === 200 && data.body.response !== undefined) {
      const measurementTypeObj: any = Object.values(data.body.response)[this.measurementTypeIndex];
      if (measurementTypeObj !== undefined && measurementTypeObj.displayValue !== undefined) {
        result = measurementTypeObj.displayValue;
      } else {
        result = '-';
      }
    } else {
      result = '-';
    }
    return result;
  }
  getGridData(item) {
    let serialNumberKey: any = null;
    let rowData: any = {};
    // get all the command response except the serial number
    this.getSitransGridData(item.shieldNumber, item.channelNumber, this.cmdList)
      .pipe(
        tap((sitransData: any) => {
          rowData = {
            tag: this.setTag(sitransData[2], sitransData[1]),
            shieldNumber: item.shieldNumber,
            channelNumber: item.channelNumber,
            pvValue: this.getPvValue(sitransData[3]),
            status: this.decodeDiagnosticStatus(this.getDiagnosticStateInfo(sitransData[0])),
            statusCode: this.getDiagnosticStateInfo(sitransData[0]),
            deviceTypeID: item.deviceTypeID,
            deviceRevision: item.deviceRevision,
            manufacturerId: item.manufacturerId,
            model: item.model,
            manufacturerName: item.manufacturerName,
            measurementType: this.getMeasurementType(sitransData[4]),
            displayChannelNumber: item.channelNumber + 1, // as channel number starts from 1 to 8 not 0 to 7
            isDeviceSupported: sitransData[3].status === 521 ? false : true,
            serialNumber: '-',
            modifiedDate: new Date()
          };
          const statusCode = this.mapDeviceHealthCode(rowData.statusCode);
          this.diagnosticStateCount[statusCode !== undefined ? statusCode : -1]++;
          return rowData;
        }),
        flatMap(x => {
          // get the node id for serial number
          return this.getNodeId(item.deviceTypeID, item.deviceRevision, item.manufacturerId);
        }),
        flatMap(y => {
          // get the command list for serial number sing node id
          if (y.body !== undefined) {
            const responseData: any = y.body;
            return this.getCommandsBasedOnNodeId(responseData.opcuaNodeID[0], item.deviceTypeID, item.deviceRevision, item.manufacturerId);
          }
          // returns an observable
        }),
        flatMap(z => {
          // call the corresponding command for the serial number
          const responseData: any = z.body;
          serialNumberKey = responseData.parameter;
          if (responseData !== undefined && responseData.commandList !== undefined && responseData.commandList.length > 0) {
            return this.getCommandResponse(item.shieldNumber, item.channelNumber, responseData.commandList[0].HARTCommand, responseData.commandList[0].TransactionNumber !== undefined ? responseData.commandList[0].TransactionNumber : 0);  // returns an observable
          } else {
            // if command list is empty.
            return of('error');
          }
        }))
      .subscribe((serialNumberData: any) => { // forkJoin returns array of results
        if (serialNumberData !== undefined && serialNumberData !== 'error' && serialNumberData.response !== undefined && serialNumberData.response[serialNumberKey] !== undefined) {
          rowData.serialNumber = serialNumberData.response[serialNumberKey].displayValue;
        }
        this.sitransList.push(rowData);
        // to turn off the loader if the data load is complete
        this.checkIfGridDataLoadedCompletely();
      }, (err) => {
        this.sitransList.push(rowData);
        // to turn off the loader if the data load is complete
        this.checkIfGridDataLoadedCompletely();
        return err;
      });
  }
  checkIfGridDataLoadedCompletely() {
    if (this.scanData.length === this.sitransList.length) {
      this.gridProperties.isGridDataLoaded = true;
      this.loader.display(false);
    }
  }
  getLatestPVandStatusValues(cmdList) {
    if (this.scanData !== undefined && this.scanData.length !== 0) {
      this.scanData.forEach(item => {
        this.getSitransData(item.shieldNumber, item.channelNumber, cmdList);
      });

    }
  }
  // function to get data from command trigger
  getSitransData(shieldNumber, channelNumber, cmdList) {
    this.getSitransGridData(shieldNumber, channelNumber, cmdList)
      .subscribe((updatedData: any) => {
        let itemIndex = -1;
        itemIndex = this.sitransGridList.findIndex(x => x.shieldNumber === shieldNumber && x.channelNumber === channelNumber);
        if (itemIndex !== -1) {
          const statusCode = this.mapDeviceHealthCode(this.sitransGridList[itemIndex].statusCode);
          // decrement the diagnostic state count
          this.diagnosticStateCount[statusCode !== undefined ? statusCode : -1]--;
          // update PV value and daignostic state value
          this.sitransGridList[itemIndex].pvValue = this.getPvValue(updatedData[0]);
          this.sitransGridList[itemIndex].status = this.decodeDiagnosticStatus(this.getDiagnosticStateInfo(updatedData[1]));
          this.sitransGridList[itemIndex].statusCode = this.getDiagnosticStateInfo(updatedData[1]);
          // Increment the diagnostic state count acordingto the latest update
          this.diagnosticStateCount[statusCode !== undefined ? statusCode : -1]++;
          // copying the updated  list  that populates the data in grid in to the swirex list view;
          this.sitransGridList.forEach(gridElement => {
            const index = this.sitransList.findIndex(x => x.shieldNumber === gridElement.shieldNumber && x.channelNumber === gridElement.channelNumber);
            if (index > -1) {
              this.sitransList[index].pvValue = gridElement.pvValue;
              this.sitransList[index].status = gridElement.status;
              this.sitransList[index].statusCode = gridElement.statusCode;
              this.sitransList[index].modifiedDate = new Date();
            }
          });
        }
      }, (err) => {
        return err;
      });
  }
  rowRefreshUpdatePVandStatus(shieldNumber, channelNumber, cmdList, rowData) {
    this.getSitransGridData(shieldNumber, channelNumber, cmdList)
      .subscribe((updatedData: any) => {
        const statusCode = this.mapDeviceHealthCode(rowData.statusCode);
        // decrement the diagnostic state count
        this.diagnosticStateCount[statusCode !== undefined ? statusCode : -1]--;
        // update PV value and daignostic state value
        rowData.pvValue = this.getPvValue(updatedData[0]);
        rowData.status = this.decodeDiagnosticStatus(this.getDiagnosticStateInfo(updatedData[1]));
        rowData.statusCode = this.getDiagnosticStateInfo(updatedData[1]);
        // Increment the diagnostic state count acordingto the latest update
        this.diagnosticStateCount[statusCode !== undefined ? statusCode : -1]++;
        // copying the updated  list  that populates the data in grid in to the sitrans list view;
        const index = this.sitransList.findIndex(x => x.shieldNumber === shieldNumber && x.channelNumber === channelNumber);
        if (index > -1) {
          this.sitransList[index].pvValue = rowData.pvValue;
          this.sitransList[index].status = rowData.status;
          this.sitransList[index].statusCode = rowData.statusCode;
          this.sitransList[index].modifiedDate = new Date();
        }
      }, (err) => {
        return err;
      });
  }
  getNodeId(deviceTypeID: string, deviceRevision: number, manufacturerId: number) {
    const opcuaBrowseName = 'http://opcfoundation.org/UA/DI/SerialNumber';
    return this.http.get(`${this.appService.eddParserUrl}api/v1/getNodeIDFromOPCUABrowseName?deviceType=${deviceTypeID}&deviceRevision=${deviceRevision}&manufacturerId=${manufacturerId}&opcuaBrowseName=${opcuaBrowseName}`, { observe: 'response' });
  }
  getCommandsBasedOnNodeId(nodeId: string, deviceTypeID: string, deviceRevision: number, manufacturerId: number) {
    return this.http.get(`${this.appService.eddParserUrl}api/v1/getCommand?OPCUAnodeId=${nodeId}&deviceType=${deviceTypeID}&deviceRevision=${deviceRevision}&manufacturerId=${manufacturerId}`, { observe: 'response' });
  }
  getCommandResponse(shieldNumber: number, channelNumber: number, command: number, transaction: number) {
    return this.http.post(`${this.deviceDataService.cmdUrl}shield=${shieldNumber}&channel=${channelNumber}&command=${command}&transaction=${transaction}`, { observe: 'response' });
  }
}
