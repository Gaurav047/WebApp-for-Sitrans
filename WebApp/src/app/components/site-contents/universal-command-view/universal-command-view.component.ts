import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '@app/services/shared/loader.service';
import { UniversalCommandViewService } from './universal-command-view.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-universal-command-view',
  templateUrl: './universal-command-view.component.html',
  styleUrls: ['./universal-command-view.component.scss'],
  providers: [UniversalCommandViewService]
})
export class UniversalCommandViewComponent implements OnInit {
  @Input() params: any; // shield info  from the siwarex grid to send to the detailed view
  @Output() closeDetailView = new EventEmitter();
  universalCommands: any;
  detailDeviceData: any;
  showLoader: boolean; // screen loader
  cols: any;
  dataSpec: any;
  selectedCommandItem: any;
  noCommandSelectedErr: any;
  hasCommandFailed: boolean;
  constructor(public universalCmdService: UniversalCommandViewService, private loaderService: LoaderService, private datePipe: DatePipe) {
    this.cols = [{ field: 'parameter', header: 'Parameter' },
    { field: 'value', header: 'Value' }];
    this.universalCommands = {
      commandList: [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '12', value: 12 },
        { label: '13', value: 13 },
        { label: '14', value: 14 },
        { label: '15', value: 15 },
        { label: '16', value: 16 },
        { label: '20', value: 20 },
        { label: '21', value: 21 },
        { label: '48', value: 48 }
      ],
      selectedCommand: { label: '--Select--', value: null }
    };
    // code to subscrive the loader  service
    this.loaderService.detailViewstatus.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    this.noCommandSelectedErr = false;
  }
  ngOnInit() {
    this.getDataSpec();
  }
  // closeing the detailved view side bar
  closeSidebar() {
    const data = { isDetailViewClose: true };
    this.closeDetailView.emit(data);
  }
  onCommandSelect(event: any) {
    this.noCommandSelectedErr = false;
    this.hasCommandFailed = false;
    if (event !== undefined) {
      this.universalCommands.selectedCommand.value = event.value;
      this.universalCommands.selectedCommand.label = event.label;
      this.selectedCommandItem = this.detailDeviceData.filter(x => x.command === event.value)[0];
      // clear the model values;
      this.selectedCommandItem.data = [];
      this.selectedCommandItem.inputParameterDetails.forEach(input => {
        // if there is a default value provide then use the default value
        input.parameterValue = input.defaultValue !== null ? input.defaultValue : null;
        input.decodeValue = { label: '--Select--', value: null };
        input.error = undefined;
        if (input.errors !== undefined) {
          input.errors.length = 0;
        }
      });
    }
  }
  onValueSelectForWrite(event, data) {
    this.onInputFieldChange(data, event);
    data.decodeValue.value = event.value;
    data.decodeValue.label = event.label;
    data.parameterValue = event.value;
    data.isWriteSuccess = null;
  }
  validate = (data, field, type, typeOptions = null) => {
    let isError = false;
    let value = data[field];
    value = (value !== null && value !== undefined) ? value.toString() : null;
    if (type === 'required') {
      if (!value) {
        isError = true;
      }
    } else if (type === 'format') {
      // if (typeOptions.indexOf('string') !== -1) {
      //   isError = typeof (value) === typeOptions ? false : true;
      // } else
      if (typeOptions.indexOf('unsigned') !== -1) {
        isError = (!isNaN(value) && value.indexOf('.') === -1) ? false : true;
      } else if (typeOptions === 'float') {
        isError = !isNaN(value) ? false : true;
      }
    } else if (type === 'range') { // range check
      if (typeOptions.dataType.indexOf('unsigned') !== -1 && (typeOptions.length !== undefined && parseInt(value, 10) > parseInt(typeOptions.length, 10))) {
        isError = true;
      } else if (typeOptions.dataType === 'float' && (parseFloat(value) < parseFloat(typeOptions.minimum) || parseFloat(value) > parseFloat(typeOptions.maximum))) {
        isError = true;
      } else if (typeOptions.dataType.indexOf('string') !== -1 && typeOptions.length !== undefined && typeOptions.length !== '' && value.length > typeOptions.length) {
        isError = true;
      }
    }
    return isError;
  }
  validateField(data, field, validatorList) {
    data.error = data.error || {};
    data.errors = data.errors || [];
    for (let item = 0; item <= validatorList.length - 1;) {
      if (this.validate(data, field, validatorList[item].type, validatorList[item].typeOptions)) {
        data.error = validatorList[item].message;
        data.errors.push({ parameterKey: data.parameterKey, error: validatorList[item].type });
        break;
      } else {
        if (data.error !== undefined) {
          const errorIndex = this.getErrorIndex(data);
          if (errorIndex > -1) {
            data.errors.splice(errorIndex, 1);
          }
          delete data.error;
        }
        item++;
      }
    }
    // if (this.isEmpty(data.error) === true) {
    //   delete data.error;
    // }
  }
  getErrorIndex(item) {
    const index = item.errors.findIndex(x => x.parameterKey === item.parameterKey);
    return index;
  }
  onInputFieldChange(item, event) {
    item.parameterValue = event;
    this.validateField(item, 'parameterValue', item.validators);
  }
  sendCommand(selectedCommandItem) {
    if (selectedCommandItem === undefined) {
      this.noCommandSelectedErr = true;
      return;
    }
    const inputParameterDetails = selectedCommandItem.inputParameterDetails;
    if (inputParameterDetails.length > 0) {
      inputParameterDetails.forEach(eleItem => {
        this.validateField(eleItem, 'parameterValue', eleItem.validators);
      });
      const isError = inputParameterDetails.some(x => x.errors.length > 0);
      if (isError === true) {
        return;
      }
      // to set input parameters required for the respective commands
      const inputData: any = {};
      selectedCommandItem.inputParameterDetails.map(x => {
        if (x.type === 'Date') {
          x.parameterValue = this.datePipe.transform(x.parameterValue, 'yyyy-MM-dd');
        }
        inputData[x.parameterKey] = x.parameterValue;
      });
      this.getcommandData(this.universalCommands.selectedCommand.value, inputData);
    } else {
      this.getcommandData(this.universalCommands.selectedCommand.value);
    }
  }
  getcommandData(command: number, inputData?: any) {
    const indexByCommand = this.detailDeviceData.findIndex(x => x.command === command);
    this.loaderService.displayDetailViewLoader(true);
    this.universalCmdService.getCommandDetails(this.params.shieldNumber, this.params.channelNumber, command, this.params.deviceTypeID, inputData).subscribe((result: any) => {
      this.hasCommandFailed = false;
      const cmdResult = (result !== undefined && result.response !== undefined) ? result.response : [];
      this.loaderService.displayDetailViewLoader(false);
      if (indexByCommand !== -1) {
        this.detailDeviceData[indexByCommand].data = [];
        if (cmdResult.length !== 0) {
          for (const item in cmdResult) {
            if (item) {
              const cmdData = { parameter: cmdResult[item].parameterLabel, value: cmdResult[item].displayValue };
              this.detailDeviceData[indexByCommand].data.push(cmdData);
            }
          }
        } else {

        }
      }
    }, (err) => {
      this.hasCommandFailed = true;
      this.loaderService.displayDetailViewLoader(false);
      this.detailDeviceData[indexByCommand].data = [];
    });
  }
  getDataSpec() {
    this.dataSpec = [];
    this.loaderService.displayDetailViewLoader(true);
    this.universalCmdService.getDataSpec().subscribe((dataSpec: any) => {
      this.loaderService.displayDetailViewLoader(false);
      this.dataSpec = dataSpec;
      this.setUpInputData(dataSpec);
    });
  }
  // to arrange the devicedata list as the the dataspec.(inserting the input parameters if any)
  setUpInputData(dataSpec: any) {
    this.detailDeviceData = [];
    // to check if input parameters are needed.
    // [] input parameters for the commands which doesnt need input
    this.universalCommands.commandList.forEach((ele: any) => {
      const index = dataSpec.findIndex(x => x.command === ele.value);
      const obj = {
        command: ele.value,
        inputParameterDetails: index !== -1 ? this.dataSpec[index].inputParameter : [],
        data: []
      };
      obj.inputParameterDetails.forEach(item => {
        item.dataEncode = this.getEncodedData(item.dataEncode);
        item.decodeValue = item.dataEncode !== null ? { label: '--Select--', value: null } : null;
        item.validators = [{ type: 'required', typeOptions: null, message: 'field cannot be empty' },
        { type: 'format', typeOptions: item.type, message: `value should be a ${item.type === 'string' ? `string` : `number`}` }];
        if (item.dataEncode === null) {
          // range check only if its is not a drop down type
          item.validators.push({ type: 'range', typeOptions: { length: item.length, dataType: item.type }, message: item.type === 'string' ? `max length should be within ${item.length} characters` : `max length should be within a range of ${item.length}` });
        }
      });

      this.detailDeviceData.push(obj);
    });
  }
  // function used to append dropdown values as per data spec
  getEncodedData(dataEncodeItem) {
    let decodeList: any;
    if (dataEncodeItem !== null) {
      decodeList = [];
      for (const key in dataEncodeItem) {
        if (key) {
          decodeList.push({ label: dataEncodeItem[key], value: key });
        }
      }
      return decodeList;
    } else {
      return null;
    }
  }
  onDateSelect(selectedDate, item) {
    if (selectedDate !== null && item.error !== undefined) {
      delete item.error;
      item.errors.length = 0;
    }
  }
}
