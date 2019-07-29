import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs';
import * as _ from 'lodash';
import { AppService } from '@app/services/shared/app.service';
import { LoaderService } from '@app/services/shared/loader.service';
import { map } from 'rxjs/operators';
import { ShieldChannelAccessService } from '@app/services/config-services/shield-channel-access.service';
import { SitransListviewService } from '@app/components/site-contents/sitrans-listview/sitrans-listview.service';

const shieldText = 'Device ';
const channelText = 'Channel ';
const parameterText = ' Parameters';
@Injectable({
  providedIn: 'root'
})
export class ParameterConfigurationService {
  channelValue = [];
  shieldValue = [];
  deviceNames = [];

  getchannel(channnelContainer, parameterContainer, channelValue) {
    channnelContainer.push({
      'label': channelValue,
      'children': parameterContainer
    });
  }

  getShield(shieldContainer, channnelContainer, shieldVlaue) {
    shieldContainer.push({
      'label': shieldVlaue,
      'children': channnelContainer
    });
  }

  constructor(private http: HttpClient, private appService: AppService, private loaderService: LoaderService, private shieldChannelService: ShieldChannelAccessService, public sitransGridService: SitransListviewService) {
  }
  // for displaying the shield/device names saved in database
  getConnectedShieldNames() {
    this.loaderService.display(true);
    this.shieldChannelService.getShieldNameDetails().subscribe(deviceNamesByShieldId => {
      this.deviceNames = deviceNamesByShieldId;
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  // Function to convet responce to the tree structure
   dataConnstructionForTreeView(data, disable?) {
  //   const displayData = [];
  //   const dataGroupedByShieldId = _.groupBy(data, 'shield');
  //   let shieldIsSelected: boolean;
  //   let channelIsSelected: boolean;
  //   // loop through the shields only that is connected
  //   let connectedShields;
  //   // getting connected shioelds data from siwarex grid service
  // //  connectedShields = this.sitransGridService.availableShieldsData;

  //   // loop in through shield to get shield structure for display
  //   for (let shieldIndex = 1; shieldIndex <= connectedShields.length; shieldIndex++) {
  //     shieldIsSelected = false;
  //     const deviceIndex = connectedShields[shieldIndex - 1];
  //     const displayShieldParameters = {
  //       'data': {
  //         'name': this.deviceNames[deviceIndex - 1].shieldName,
  //         'isSelected': shieldIsSelected
  //       },
  //       'children': []
  //     };


  //     const dataGroupedByChannelId = _.groupBy(dataGroupedByShieldId[shieldIndex], 'channel');
  //     // change the name of channel when it is null s shield parameters
  //     for (const channelIndex in dataGroupedByChannelId) {
  //       if (channelIndex) {
  //         let channelname;
  //         if (channelIndex === '101') {
  //           channelname = shieldText + parameterText;
  //         } else {
  //           channelname = channelText + channelIndex;
  //         }
  //         const parameterDataFromGroup = dataGroupedByChannelId[channelIndex];
  //         const displayChannelParameters = {
  //           'data': {
  //             'name': channelname,
  //             'isSelected': channelIsSelected,
  //             'parentShield': shieldIndex
  //           },
  //           'children': []
  //         };
  //         channelIsSelected = false;
  //         // get parameter data structure
  //         for (const parameterIndex in parameterDataFromGroup) {
  //           if (parameterIndex) {
  //             const parameterData = {
  //               'data': {
  //                 'name': '',
  //                 'paraName': parameterDataFromGroup[parameterIndex].parameter,
  //                 'isSelected': parameterDataFromGroup[parameterIndex].isSelected === 1 ? true : false,
  //                 'parentChannel': parameterDataFromGroup[parameterIndex].channel,
  //                 'parentShield': parameterDataFromGroup[parameterIndex].shield,
  //                 'frequency': parameterDataFromGroup[parameterIndex].frequency
  //               }
  //             };
  //             displayChannelParameters.children.push(parameterData);
  //             if (channelIsSelected === false && parameterData.data.isSelected === true) {
  //               channelIsSelected = true;
  //             } else {
  //               // do nothing
  //             }
  //           }
  //         }
  //         // for getting data toggle changes for channel
  //         displayChannelParameters.data.isSelected = channelIsSelected;
  //         displayShieldParameters.children.push(displayChannelParameters);
  //         if (shieldIsSelected === false && displayChannelParameters.data.isSelected === true) {
  //           shieldIsSelected = true;
  //         } else {
  //           // do nothing
  //         }
  //       }
  //     }
  //     // for getting data toggle changes for shield
  //     displayShieldParameters.data.isSelected = shieldIsSelected;
  //     displayData.push(displayShieldParameters);

  //   }
  //   return displayData;
  // sonarqube fix
  return;
  }
  getConfigurationData(configScreen) {
    return this.http.get<any>(`${this.appService.configServicesUrl}${configScreen}/getConfigData`);
  }
  getFrequencyData(configScreen) {
    return this.http.get<any>(`${this.appService.configServicesUrl}${configScreen}/getFrequency`);
  }
  saveConfigurationData(configScreen, configData, frequency) {
    let dataToDeconstruct = [];
    dataToDeconstruct = configData;
    let dataToSave: any;
    let dataObj = {};
    dataToSave = [];
    dataToDeconstruct.forEach(shieldEle => {
      // shieldEle.data.name -->shieldId
      shieldEle.children.forEach(channelEle => {
        // channelEle.data.name -->channelName
        channelEle.children.forEach(parameterEle => {
          // parameterEle.data.paraName
          dataObj = {
            shield: parameterEle.data.parentShield,
            channel: parameterEle.data.parentChannel,
            parameter: parameterEle.data.paraName,
            isSelected: parameterEle.data.isSelected === true ? 1 : 0,
            frequency: frequency,
          };
          dataToSave.push(dataObj);
        });
      });
    });
    // // this will update the DB in backend on click of save
    // this.loaderService.display(true);
    return this.http.post(`${this.appService.configServicesUrl}${configScreen}/updateConfigData`, dataToSave)
      .pipe(map(data => {
        return data;
      },
      (err) => {
        return err;
      }));

  }



  getMindConnectKeyData(configScreen) {
    const url = this.appService.configServicesUrl + configScreen + '/getOnboardingKey';
    return this.http.get<any>(url);
  }

  saveMindConnectKeyData(configScreen, updatedKey) {
    this.http.post(`${this.appService.configServicesUrl}${configScreen}/setOnBoardingKey`, updatedKey).subscribe(res => {
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
}
