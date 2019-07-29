import { Component, OnInit } from '@angular/core';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';
const mindConnectConfig = 'mindConnect';
import { LoaderService } from '@app/services/shared/loader.service';
import { ToastMessageService } from '@app/services/shared/toast-message.service';

@Component({
  selector: 'app-mind-connect-onboarding',
  templateUrl: './mind-connect-onboarding.component.html',
  styleUrls: ['./mind-connect-onboarding.component.scss']
})
export class MindConnectOnboardingComponent implements OnInit {
  configKeyData: any;
  constructor(private parameterConfigurationService: ParameterConfigurationService, private loaderService: LoaderService, private toastMessageService: ToastMessageService) { }

  ngOnInit() {
    this.getOnBoardingKeyData();
  }
  // function to get the onboarding key data from backend
  getOnBoardingKeyData() {
    this.loaderService.display(true);
    this.parameterConfigurationService.getMindConnectKeyData(mindConnectConfig).subscribe(res => {
      this.configKeyData = res;
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  // function to save the edited onboarding key data to backend
  saveOnBoardingKey() {
    const data = { 'onBoardingKey': this.configKeyData };
    this.parameterConfigurationService.saveMindConnectKeyData(mindConnectConfig, data);
    this.getOnBoardingKeyData();
    // function to get transient pop up with save message after data is saved
    const saveMsg = 'Saved Successfully';
    this.toastMessageService.addSingleToast(saveMsg);
  }
  // cancel the changes that user dont want to save
  cancelChanges() {
    this.getOnBoardingKeyData();
  }
}
