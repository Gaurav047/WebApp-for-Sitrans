import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import { AppService } from '@app/services/shared/app.service';
import * as _ from 'lodash';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';
import { ParameterConfigurationComponent } from '../../shared/parameter-configuration/parameter-configuration.component';
import { LoaderService } from '@app/services/shared/loader.service';
import { ToastMessageService } from '@app/services/shared/toast-message.service';
const mindConnectConfig = 'mindConnect';
@Component({
  selector: 'app-mind-connect',
  templateUrl: './mind-connect.component.html',
  styleUrls: ['./mind-connect.component.scss']
})
export class MindConnectComponent extends ParameterConfigurationComponent implements OnInit {
  disableBtn: boolean;
  configFrequency: any;
  frequency: any;

  constructor(protected http: HttpClient, protected appService: AppService, protected parameterConfigurationService: ParameterConfigurationService, private loaderService: LoaderService, private toastMessageService: ToastMessageService) {
    super(http, appService, parameterConfigurationService);
  }
  ngOnInit() {
    this.getConfigData();
    this.getFrequencyData();
  }
  // function to fetch data from backend
  getConfigData() {
    this.disableBtn = true;
    this.loaderService.display(true);
    this.parameterConfigurationService.getConfigurationData(mindConnectConfig).subscribe(res => {
      this.configData = [];
     // this.configData = this.parameterConfigurationService.dataConnstructionForTreeView(res, this.disableFrequency);
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  // function to fetch saved frequency from database
  getFrequencyData() {
    this.loaderService.display(true);
    this.parameterConfigurationService.getFrequencyData(mindConnectConfig).subscribe(res => {
      this.frequency = res[0].frequency;
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  // save the edited data back to database
  saveConfigData() {
    this.loaderService.display(true);
    this.parameterConfigurationService.saveConfigurationData(mindConnectConfig, this.configData, this.configFrequency).subscribe((res) => {
      this.getConfigData();
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
