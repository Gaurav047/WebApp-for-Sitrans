import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemSettingsService } from './system-settings.service';
import { validateField } from '@app/utility/validate';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ToastMessageService } from '@app/services/shared/toast-message.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
  @ViewChild('f') settingsForm: any;
  modbusSettings: any;
  modbusSettingsCopy: any;
  modbuDataToUpdate: any;
  @ViewChild('confirmSaveSettings') confirmSaveSettingsRef: ConfirmationDialogComponent;
  constructor(public settingService: SystemSettingsService, private toastMessageService: ToastMessageService) { }

  ngOnInit() {
    this.getSystemSettings();
    this.getModbussettingData();
  }
  decodeParameterValue(parameterName, dataToEncode) {
    let result: any = '';
    if (parameterName === 'Baudrate') {
      switch (dataToEncode) {
        case '9600': result = 0;
          break;
        case '19200': result = 1;
          break;
        case '57.600': result = 2;
          break;
        case '115.200': result = 3;
          break;
        default: result = 1;
          break;
      }
    } else if (parameterName === 'Parity') {
      switch (dataToEncode) {
        case 'even': result = 0;
          break;
        case 'odd': result = 1;
          break;
        case 'no parity': result = 2;
          break;
        default: result = 0;
          break;
      }

    } else if (parameterName === 'DataBits') {
      switch (dataToEncode) {
        case '7': result = 0;
          break;
        case '8': result = 1;
          break;
        default: result = 1;
          break;
      }
    } else if (parameterName === 'StopBits') {
      switch (dataToEncode) {
        case '1': result = 0;
          break;
        case '2': result = 1;
          break;
        default: result = 0;
          break;
      }
    }
    return result;
  }
  getModbussettingData() {
    this.settingService.getRs485Parameters().subscribe(res => {
      const configData = JSON.parse(res);
      this.modbusSettings = [{
        name: 'Baudrate',
        unit: 'Bits/s',
        value: [{ name: '9600', code: 0 },
        { name: '19200', code: 1 },
        { name: '38400', code: 2 },
        { name: '57600', code: 3 },
        { name: '115000', code: 4 }],
        updateValue: configData.CURRENT_BAUD_RATE,
        placeholder: configData.CURRENT_BAUD_RATE
      },
      {
        name: 'Parity',
        value: [{ name: 'even', code: 0 },
        { name: 'odd', code: 1 },
        { name: 'no parity', code: 2 }],
        updateValue: configData.PARITY.toLowerCase(),
        placeholder: configData.PARITY.toLowerCase()
      },
      {
        name: 'DataBits', unit: 'data bits',
        value: [{ name: '7', code: 0 },
        { name: '8', code: 1 }],
        updateValue: configData.DATA_BITS,
        placeholder: configData.DATA_BITS
      },
      {
        name: 'StopBits', unit: 'stop bits',
        value: [{ name: '1', code: 0 },
        { name: '2', code: 1 }],
        updateValue: configData.STOP_BITS,
        placeholder: configData.STOP_BITS
      }];
      this.modbusSettingsCopy = this.takeCopyForCompare(this.modbusSettings);
    });
  }
  takeCopyForCompare(data) {
    const copyData = data.map((x: any) => {
      return { [x.name]: x.updateValue.name };
    });
    return copyData;
  }
  getSystemSettings() {
    this.settingService.getSystemSettings().subscribe((settingsData: any) => {
      // Webapp settings bindind
      settingsData.forEach(itemFromDb => {
        const modelItemIndex = this.settingService.systemSettingModel.findIndex(x => x.parameterKey === itemFromDb.parameterKey);
        if (modelItemIndex !== -1) {
          this.settingService.systemSettingModel[modelItemIndex].parameterValue = itemFromDb.parameterValue;
          this.settingService.systemSettingModel[modelItemIndex].error = undefined;
        }
      });
      // device settings binding
      this.settingService.getScanFrequency().subscribe(scanFrequency => {
        this.settingService.deviceSettingsModel.scanFrequency.parameterValue = (scanFrequency !== undefined && scanFrequency.interval !== undefined) ? scanFrequency.interval.toString() : 'NA';
        this.settingService.deviceSettingsModel.scanFrequency.error = undefined;
      }, err => {
        this.settingService.deviceSettingsModel.scanFrequency.parameterValue = 'NA';
        this.settingService.deviceSettingsModel.scanFrequency.error = 'Error in loading data';
      });
    }, (err) => {
      return err;
    });
  }
  saveChanges() {
    this.settingService.systemSettingModel.forEach(ele => {
      validateField(ele, 'parameterValue', ele.validators);
    });
    validateField(this.settingService.deviceSettingsModel.scanFrequency, 'parameterValue', this.settingService.deviceSettingsModel.scanFrequency.validators);
    const isWebSettingError = this.settingService.systemSettingModel.some(x => x.error !== undefined);
    const isDeviceSettingError = this.settingService.deviceSettingsModel.scanFrequency.error !== undefined;
    if (isWebSettingError === false && isDeviceSettingError === false) {
      this.confirmSaveSettingsRef.confirm().subscribe((isaccepted) => {
        if (isaccepted === true) {
          this.saveIntervalSetting().then(() => {
            this.settingService.setScanFrequency(this.settingService.deviceSettingsModel.scanFrequency.parameterValue).subscribe(result => {
            }, err => {
              return err;
            });
            const dataCopyOnSave = this.takeCopyForCompare(this.modbusSettings);
            const ifDataChanged = dataCopyOnSave.some((x, i) => Object.values(x)[0] !== Object.values(this.modbusSettingsCopy[i])[0]);
            if (ifDataChanged) {
              this.saveModbusSetting();
              this.modbusSettingsCopy = this.modbusSettings.map((x: any) => {
                return { [x.name]: x.updateValue.name };
              });
            }
            this.toastMessageService.addSingleToast('Saved Successfully');
          });
        }
      }, (err) => {
        return err;
      });
    }
  }
  onInputFieldChange(item, event) {
    item.parameterValue = event;
    validateField(item, 'parameterValue', item.validators);
  }
  cancelChanges() {
    this.getSystemSettings();
  }
  // function for saving modbus settings
  saveModbusSetting() {
    const dataToBeUpdate = {
      'ParameterValue': {
        'Baudrate': 1,
        'Parity': 0,
        'DataBits': 1,
        'StopBits': 0
      }
    };
    this.modbusSettings.forEach(element => {
      if (element.updateValue !== '' && element.updateValue !== undefined && element.updateValue !== null) {
        switch (element.name) {
          case 'Baudrate': dataToBeUpdate.ParameterValue.Baudrate = +element.updateValue.code; this.modbuDataToUpdate = dataToBeUpdate;
            break;
          case 'Parity': dataToBeUpdate.ParameterValue.Parity = +element.updateValue.code; this.modbuDataToUpdate = dataToBeUpdate;
            break;
          case 'DataBits': dataToBeUpdate.ParameterValue.DataBits = +element.updateValue.code; this.modbuDataToUpdate = dataToBeUpdate;
            break;
          case 'StopBits': dataToBeUpdate.ParameterValue.StopBits = +element.updateValue.code; this.modbuDataToUpdate = dataToBeUpdate;
            break;
          default: this.modbuDataToUpdate = dataToBeUpdate;
            break;
        }
      } else {
        this.modbuDataToUpdate = dataToBeUpdate;
      }
    });
    this.settingService.updateModbusSettings(dataToBeUpdate).subscribe(res => {
    });
  }
  saveIntervalSetting() {
    return new Promise((resolve, reject) => {
      this.settingService.updateSystemSettings(this.settingService.systemSettingModel)
        .subscribe((data: any) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
  onScanFrequencyChange() {
    validateField(this.settingService.deviceSettingsModel.scanFrequency, 'parameterValue', this.settingService.deviceSettingsModel.scanFrequency.validators);
  }
}

