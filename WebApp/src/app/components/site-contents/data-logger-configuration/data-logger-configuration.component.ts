import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';
import { AppService } from '@app/services/shared/app.service';
import * as _ from 'lodash';
import { ParameterConfigurationComponent } from '../../shared/parameter-configuration/parameter-configuration.component';
import { LoaderService } from '@app/services/shared/loader.service';
import { ToastMessageService } from '@app/services/shared/toast-message.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
const dataLoggerConfig = 'dataLogger';
@Component({
  selector: 'app-data-logger-configuration',
  templateUrl: './data-logger-configuration.component.html',
  styleUrls: ['./data-logger-configuration.component.scss']
})
export class DataLoggerConfigurationComponent extends ParameterConfigurationComponent implements OnInit {
  disableBtn: boolean;
  response: any;
  errorMessage: String = '';
  configFrequency: any;
  frequency: any;
  constructor(protected http: HttpClient, protected appService: AppService, protected parameterConfigurationService: ParameterConfigurationService, private loaderService: LoaderService, private toastMessageService: ToastMessageService) {
    super(http, appService, parameterConfigurationService);
  }
  ngOnInit() {
    this.disableBtn = false;
    this.getConfigData();
    this.getFrequencyData();
  }
  // function to fetch data from backend
  getConfigData() {
    this.loaderService.display(true);
    this.disableBtn = true;
    this.parameterConfigurationService.getConfigurationData(dataLoggerConfig).subscribe(res => {
      this.configData = [];
      this.response = res;
    //  this.configData = this.parameterConfigurationService.dataConnstructionForTreeView(res);
      this.loaderService.display(false);

    }, (err) => {
      this.loaderService.display(false);
    });
  }
  // function to fetch saved frequency from database
  getFrequencyData() {
    this.loaderService.display(true);
    this.parameterConfigurationService.getFrequencyData(dataLoggerConfig).subscribe(res => {
      this.frequency = res[0].frequency;
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  // save the edited data back to database
  saveConfigData() {
    this.loaderService.display(true);
    this.parameterConfigurationService.saveConfigurationData(dataLoggerConfig, this.configData, this.configFrequency).subscribe((res) => {
      this.getConfigData();
      // function to get transient pop up with save message after data is saved
      const saveMsg = 'Saved Successfully';
      this.toastMessageService.addSingleToast(saveMsg);
    }, (err) => {
      this.loaderService.display(false);
    });

  }
  // cancel the changes that user dont want to save
  cancelConfig() {
    this.getConfigData();
  }
  // disable save button till any changes are made
  disableStatus(event) {
    this.disableBtn = event;
  }
  commonFrequency(event) {
    this.configFrequency = event;
  }
}
