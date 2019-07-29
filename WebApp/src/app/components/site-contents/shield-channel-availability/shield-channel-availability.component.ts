import { Component, OnInit } from '@angular/core';
import { ShieldChannelAccessService } from '@app/services/config-services/shield-channel-access.service';
import * as _ from 'lodash';
import { LoaderService } from '@app/services/shared/loader.service';
import { SitransListviewService } from '@app/components/site-contents/sitrans-listview/sitrans-listview.service';
import { ToastMessageService } from '@app/services/shared/toast-message.service';

@Component({
  selector: 'app-shield-channel-availability',
  templateUrl: './shield-channel-availability.component.html',
  styleUrls: ['./shield-channel-availability.component.scss']
})
export class ShieldChannelAvailabilityComponent implements OnInit {
  shieldData: any;
  channelData: any;
  currentShieldIndex: number;
  indexOfChannel: number;
  multiDropOption: any[];
  channelInfo: any;
  shieldConnection = ' SITRANS MX300 connected';
  deviceConnection = ' Device connected';
  parseScanData: any;
  scanDataResult: any;
  multiDropValue: any = [];
  multiDropTitle: String = 'Multi Drop Address';
  ifShieldNotConnected: boolean;
  scanTimeOutError: boolean;
  errorInfoMessage: String = '';
  shieldinfoMessage: String = '';
  scaninfoMessage: String = '';
  multiDropMessage: String = '';
  constructor(private shieldChannelService: ShieldChannelAccessService,
    private loaderService: LoaderService, public sitransListService: SitransListviewService, private toastMessageService: ToastMessageService) {
    // this.multiDrop = { label: 'Multidrop Address' };
    this.multiDropOption = [
      { value: '0', label: '0' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '10', label: '10' },
      { value: '11', label: '11' },
      { value: '12', label: '12' },
      { value: '13', label: '13' },
      { value: '14', label: '14' },
      { value: '15', label: '15' }
    ];
  }
  ngOnInit() {
    this.shieldinfoMessage = `1) Only connected SITRANS MX300 can be modified.`;
    this.scaninfoMessage = `2) Disabled SITRANS MX300 will be excluded from scan.`;
    this.multiDropMessage = `3) Select multidrop address as applicable.`;
    this.ifShieldNotConnected = false;
    this.scanTimeOutError = false;
    // Initial Loading data for ShieldChannel Access
    this.loadShieldChannelAccessData();
  }
  // function for Loading data for ShieldChannel Access
  loadShieldChannelAccessData() {
    this.loaderService.display(true);
    this.shieldData = [];
    this.shieldChannelService.getShieldChannelAccessData().subscribe(data => {
      const dataGroupedByShieldId = _.groupBy(data, 'shieldId');
      for (const key in dataGroupedByShieldId) {
        if (key) {
          const children = [];
          dataGroupedByShieldId[key].forEach((x) => {
            const channelData = {
              'name': 'Channel ' + (x.channelId + 1),
              'id': x.channelId,
              'shieldId': key,
              'isActive': x.isActive === 1 ? true : false,
              'multiDropAddress': x.multiDropAddress,
              'isChannelConnected': false,
              'disableMultiDrop': false
            };
            // children formed for each shield and corresponding channels
            // (to get  differnet referenced channels for every shield)
            children.push(channelData);
          });
          const shieldDetails = {
            'name': 'MX300 Address ' + key,
            'isActive': dataGroupedByShieldId[key].some((y) => {
              return (y.isActive === 1); // looping through the channels
            }),
            'children': children,
            'isClicked': false
          };
          // push each sheild data to the list
          this.shieldData.push(shieldDetails);
        }
      }
      this.scanData();
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  scanData(event?) {
    this.loaderService.display(true);
    let isOnLoadScan = true;
    if (event !== undefined) {
      isOnLoadScan = false;
    }
    if (isOnLoadScan) {
      this.sitransListService.getPastScanData().subscribe((pastScanresult: any) => {
        this.scanDataResult = pastScanresult;
        this.ifShieldNotConnected = false;
        this.onScanConfiguration();
      }, (err) => {
        this.ifShieldNotConnected = true;
        this.loaderService.display(false);
      });
    } else {
      this.sitransListService.getScanData().subscribe((scanresult: any) => {
        this.scanDataResult = scanresult.body;
        this.ifShieldNotConnected = false;
        this.scanTimeOutError = false;
        this.onScanConfiguration();
      }, (err) => {
        if (err.status === 503) {
          this.scanTimeOutError = true;
          // to turn of max scan exceed error after 5 mins
          setTimeout(() => {
            this.scanTimeOutError = false;
          }, (30 * 1000));
        }
        this.loaderService.display(false);
      });
    }
  }
  onScanConfiguration() {
    this.parseScanData = this.sitransListService.parseScanData(this.scanDataResult);
    const shieldStatusConnected = this.shieldStatusData();
    this.isDeviceConnected();
    let starterShield = 0;
    // if (this.parseScanData.length > 0) {
    //   starterShield = this.parseScanData[0].shieldNumber;
    //   this.loadChannels(this.shieldData[starterShield - 1]);
    //   this.shieldData[starterShield - 1].isClicked = true;
    //   this.loaderService.display(false);
    // } else
    if (shieldStatusConnected.length > 0) {
      starterShield = shieldStatusConnected[0].shieldNumber;
      this.loadChannels(this.shieldData[starterShield - 1]);
      this.shieldData[starterShield - 1].isClicked = true;
      this.loaderService.display(false);
    } else {
      this.loadChannels(this.shieldData[0]);
      this.shieldData[0].isClicked = true;
      this.loaderService.display(false);
    }
  }
  shieldStatusData() {
    const result: any = [];
    this.scanDataResult.map(shieldInfo => {
      let obj: any = {};
      if (shieldInfo.shieldStatus === 1) {
        shieldInfo.channelData.map(channelInfo => {
          obj = {
            shieldNumber: shieldInfo.shield,
            channelNumber: channelInfo.channel
          };
          result.push(obj);
        });
      }
    });
    return result;
  }
  isDeviceConnected() {
    for (let shieldId = 1; shieldId <= 8; shieldId++) {
      if (this.scanDataResult[shieldId - 1].shieldStatus === 1) {
        this.shieldData[shieldId - 1].children.forEach((connectedChannel) => {
          connectedChannel.isChannelConnected = false;
          if (connectedChannel.isActive === false) {
            connectedChannel.disableMultiDrop = true;
          } else {
            connectedChannel.disableMultiDrop = false;
          }
        });
        this.shieldData[shieldId - 1].isShieldConnected = true;
        // this.shieldData[shieldId - 1].isActive = true;
        const channelsConnected = this.parseScanData.filter(x => {
          if (x.shieldNumber === this.scanDataResult[shieldId - 1].shield) {
            return { 'channel': x.channelNumber };
          }
        });
        channelsConnected.forEach(channel => {
          this.shieldData[shieldId - 1].children.forEach((shieldChannelItem) => {
            if (channel.channelNumber === shieldChannelItem.id) {
              shieldChannelItem.isChannelConnected = true;
              // shieldChannelItem.isActive = true;
              // shieldChannelItem.disableMultiDrop = false;
            }
          });
        });
      } else {
        this.shieldData[shieldId - 1].isShieldConnected = false;
        // this.shieldData[shieldId - 1].isActive = false;
      }
    }
  }
  // function triggers on selection of the shield
  // which will load the channel details of corresponding Shields
  loadChannels(shieldInfo: any) {
    this.channelData = [];
    // clear selection of  shield clicks before selecting another shield
    this.shieldData.forEach(element => {
      if (element.isClicked === true) {
        element.isClicked = false;
      }
    });
    // here we extract the channel data w.r.t selected shield index.
    this.currentShieldIndex = this.shieldData.findIndex((i) => i.name === shieldInfo.name);
    this.shieldData[this.currentShieldIndex].isClicked = true;
    this.channelInfo = this.shieldData.filter(x => x.name === shieldInfo.name)
      .map(y => {
        return y.children;
      });
    this.channelData = this.channelInfo[0];
    this.multiDropValue = { value: 0, label: 0 };
    this.channelData.forEach((element, index) => {
      this.multiDropValue[index] = { value: element.multiDropAddress, label: element.multiDropAddress };
    });
  }

  onChanneltoggle(event, obj) {
    // make the isActive bit to true/false on toggle selection of respective channel
    this.indexOfChannel = this.shieldData[this.currentShieldIndex].children.findIndex(x => x.name === obj.name);
    this.shieldData[this.currentShieldIndex].children[this.indexOfChannel].isActive = event.checked;
    this.shieldData[this.currentShieldIndex].children[this.indexOfChannel].disableMultiDrop = !(event.checked);
    // activate the shield if atleast one of its channel is active
    const isAnyChannelActive = this.shieldData[this.currentShieldIndex].children.some(x =>
      x.isActive === true);
    if (isAnyChannelActive === true) {
      this.shieldData[this.currentShieldIndex].isActive = true;
    } else {
      this.shieldData[this.currentShieldIndex].isActive = false;
    }
  }
  // On activating the shield
  onShieldtoggle(event, obj) {
    // if shield is isactivated , then all channel should be deactivated
    obj.isActive = event.checked;
    obj.children.forEach((channel, index) => {
      channel.disableMultiDrop = false;
      if (obj.isActive === false) {
        channel.disableMultiDrop = true;
        if (channel.isActive === true) {
          channel.isActive = false;
        }
      } else if (obj.isActive === true) {
        channel.disableMultiDrop = false;
        if (channel.isActive === false) {
          channel.isActive = true;
        }
      }
    });

  }
  // function to save all the data to the backend
  saveChanges() {
    this.loaderService.display(true);
    const dataTosave = [];
    this.shieldData.forEach(shield => {
      shield.children.forEach((channel, index) => {
        const shieldChannelObj = {
          shieldId: +channel.shieldId,
          channelId: (+channel.name.substring(channel.name.indexOf('l') + 1)) - 1,
          isActive: channel.isActive,
          multiDropAddress: channel.multiDropAddress
        };
        dataTosave.push(shieldChannelObj);
      });
    });
    this.shieldChannelService.updateShieldChannelAccess(dataTosave)
      .subscribe((res) => {
        // Re- load the saved information
        // this.loadShieldChannelAccessData();
        this.loaderService.display(false);
        const saveMsg = 'Saved Successfully';
        this.toastMessageService.addSingleToast(saveMsg);
      }, (err) => {
        this.loaderService.display(false);
      });
  }
  onDropdownChange(event, index, shield) {
    this.shieldData[shield - 1].children[index].multiDropAddress = event.value;
    this.multiDropValue[index] = { value: event.value, label: event.value };

  }
  shieldCell(shieldIndex) {
    if (shieldIndex.isClicked && shieldIndex.isShieldConnected) {
      return 'shield-cell-active';
    } else if (!shieldIndex.isShieldConnected) {
      return 'clickableContent';
    }
  }
  cancelChanges() {
    this.loadShieldChannelAccessData();
  }
  errorMessage() {
    if (this.ifShieldNotConnected) {
      this.errorInfoMessage = 'Configuration services are not running , please reboot the system.';
    } else if (this.scanTimeOutError) {
      this.errorInfoMessage = 'Maximum scan limit is exceeded.Please try again after sometime.';
    }
    return this.ifShieldNotConnected || this.scanTimeOutError;
  }
}
