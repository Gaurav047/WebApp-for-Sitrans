import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../services/shared/app.service';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { LoaderService } from '@app/services/shared/loader.service';
import { ModalPopupComponent } from '@app/components/shared/modal-popup/modal-popup.component';
import { AuthService } from '@app/services/shared/auth.service';
import { NetworkSettingsService } from '@app/services/config-services/network-settings.service';

@Component({
  selector: 'app-network-settings',
  templateUrl: './network-settings.component.html',
  styleUrls: ['./network-settings.component.scss'],
})
export class NetworkSettingsComponent implements OnInit {

  @ViewChild('confirmSave') public confirmSettingRef: ConfirmationDialogComponent;
  @ViewChild('modalRef') modalRef: ModalPopupComponent;
  @ViewChild('interfaceFileView') interfaceFileViewRef: TemplateRef<any>;
  @ViewChild('rebootCofirm') rebootCofirm: ModalPopupComponent;
  @ViewChild('rebootConfirmMsgView') rebootConfirmMsgView: TemplateRef<any>;
  @ViewChild('confirmMsgForRebootBtn') public confirmMsgForRebootBtnRef: ConfirmationDialogComponent;
  getFileData;
  fullFileData;
  staticAddtess;
  netMaskAddress;
  staticIpAddress;
  netMaskIpAddress;
  result;
  ipPort2Address;
  netmaskPort2Address;
  isNetworkChangeSaved: boolean;
  port1Checked: boolean;
  port2Checked: boolean;
  isSaveButtonDiable: boolean;
  x2P1IpAddressErrorMsg;
  rebootConfirmMsg;
  portX2P1IpAddress;
  portX2P1NetmaskAddress;
  etcText;
  configurationText;
  ifDownText;
  theLoopbackText;
  autoLoText;
  ifaceLoText;
  wiredInterfaceText;
  autoEtho0Text;
  ifaceEtho0Text;
  addressport1Text;
  netmaskport1Text;
  addressport2Text;
  netmaskport2Text;
  port1Text;
  port2Text;
  dhcpText;
  autoEtho1Text;
  ifaceEtho1Text;
  port1ValidationText;
  port2ValidationText;
  confirmMsgForReboot;
  isInterFaceFileIsAvailable: boolean;
  isRebootIsAvailable: boolean;


  // tslint:disable-next-line:max-line-length
  pattern = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
  public port1ValidationForm: FormGroup;
  public port2ValidationForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, public fb: FormBuilder, private appService: AppService,
    private loaderService: LoaderService, private auth: AuthService, public networkSettingsService: NetworkSettingsService) {
    this.port1ValidationForm = fb.group({
      ipAddress: [' ', Validators.compose([Validators.required,
      Validators.pattern(this.pattern)])],
      netMaskAddress: [' ', Validators.compose([Validators.required,
      Validators.pattern(this.pattern)])]
    });
    this.port2ValidationForm = fb.group({
      ipAddress: [' ', Validators.compose([Validators.required,
      Validators.pattern(this.pattern)])],
      netMaskAddress: [' ', Validators.compose([Validators.required,
      Validators.pattern(this.pattern)])]
    });
    this.isSaveButtonDiable = true;
    this.isInterFaceFileIsAvailable = true;
    this.isRebootIsAvailable = false;
    this.getStaticInterfaceFileViewData();
    this.getFileIpAndNetmaskAddressFromApi();
  }
  ngOnInit() {
  }
  // post call for update the interface file
  updateInterfaceMethod(data) {
    this.loaderService.display(true);
    const headerToBeSend = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const url = this.appService.configServicesUrl + 'networksetting/setInterfaceFile';
    this.http.post(url, data, { headers: headerToBeSend })
      .pipe(map((res) => res)).subscribe((res) => {
        this.result = res;
        this.isNetworkChangeSaved = true;
        this.loaderService.display(false);
      },
        (err) => {
          return err;
        });
  }
  // function for update the port 1 changes to the interface file
  changeX1P1PortAdress() {
    // checking the radio button for port1 if user select dhcp
    if (this.port1Checked === false) {
      // checking the on load file data
      if (this.port1ValidationText !== -1) {
        // string operation for changing the data in interface file for port 1
        const stringToBeRemove = this.getSubstring(this.getIndex('address ' + this.staticAddtess), this.getIndex('auto eth1') - 1);
        this.getFileData = this.fullFileData.replace('iface eth0 inet static', 'iface eth0 inet dhcp').replace(stringToBeRemove, '').trim();
      } else {
        this.getFileData = this.fullFileData;
      }
    } else {
      if (this.port1ValidationText !== -1) {
        this.getFileData = this.fullFileData.replace(this.staticAddtess, this.staticIpAddress).replace(this.netMaskAddress, this.netMaskIpAddress).trim();
      } else {
        this.getFileData = this.fullFileData.replace('iface eth0 inet dhcp', 'iface eth0 inet static' + '\n' +
          '    address' + ' ' + this.staticIpAddress + '\n' +
          '    netmask' + ' ' + this.netMaskIpAddress).trim();
      }
    }
  }
  // function for update the port 2 changes to the interface file
  changeX2P1PortAddress() {
    this.changeX1P1PortAdress();
    if (this.port2Checked === false) {
      const dataToBeCheckForDhcpInPortX2P1 = this.fullFileData.indexOf('iface eth1 inet dhcp');
      if (dataToBeCheckForDhcpInPortX2P1 === -1) {
        this.getFileData = this.getFileData.replace('iface eth1 inet static', 'iface eth1 inet dhcp');
        const lastData = this.getFileData.indexOf('iface eth1 inet dhcp');
        let lastDataToBeRemove = this.getFileData.substring(lastData);
        lastDataToBeRemove = lastDataToBeRemove.replace('iface eth1 inet dhcp', '');
        this.getFileData = this.getFileData.replace(lastDataToBeRemove, '');
        const data = { 'filedata': this.getFileData };
        this.updateInterfaceMethod(data);
      } else {
        const data = { 'filedata': this.getFileData };
        this.updateInterfaceMethod(data);
      }
    } else {
      const dataToBeCheckForDhcpInPortX2P1 = this.fullFileData.indexOf('iface eth1 inet dhcp');
      if (dataToBeCheckForDhcpInPortX2P1 === -1) {
        this.getFileData = this.getFileData.replace(this.portX2P1IpAddress, this.ipPort2Address)
          .replace(this.portX2P1NetmaskAddress, this.netmaskPort2Address).trim();
        const data = { 'filedata': this.getFileData };
        this.updateInterfaceMethod(data);
      } else {
        this.getFileData = this.getFileData.replace('iface eth1 inet dhcp', 'iface eth1 inet static' + '\n' +
          '    address' + ' ' + this.ipPort2Address + '\n' +
          '    netmask' + ' ' + this.netmaskPort2Address).trim();
        const data = { 'filedata': this.getFileData };
        this.updateInterfaceMethod(data);
      }
    }
  }
  // function for update the interface file
  saveDataTointerfaceFile() {
    this.changeX2P1PortAddress();
    this.confirmSettingRef.confirm().subscribe((isaccepted) => {
      if (isaccepted === true) {
        this.rebootDevice();
      } else {
        this.isNetworkChangeSaved = false;
      }
    },
      (err) => {
        return err;
      });
  }
  // function for get index of string
  getIndex(index) {
    const lineDataIndex = this.fullFileData.indexOf(index);
    return lineDataIndex;
  }
  // function for get substring of string
  getSubstring(start_index, end_index) {
    const lineData = this.fullFileData.substring(start_index, end_index);
    return lineData;
  }
  // function for getting the IP address or netmask address from interface file
  getFileIpAndNetmaskAddressFromApi() {
    this.networkSettingsService.getFullFileData().subscribe((res: any) => {
      this.fullFileData = res;
      // string operation for getting ip address and netmask address for port 1 from the interface file
      const endIndex = this.fullFileData.indexOf('iface eth1 inet');
      const dataForPortX1P1 = this.fullFileData.substring(this.port1ValidationText, endIndex).replace('iface eth0 inet static', '').trim();
      const startIndexForIpAddress = dataForPortX1P1.indexOf('address');
      const endIndexForIpAddress = dataForPortX1P1.indexOf('netmask');
      if (this.port1ValidationText !== -1) {
        // this line is for port 1 enable if static ip and netmask address is available on load
        this.port1Checked = true;
        this.networkSettingsService.fieldEnable(this.port1ValidationForm, 'ipAddress', 'netMaskAddress');
        // this line to get static ip address for port 1 on load
        this.staticIpAddress = dataForPortX1P1.substring(startIndexForIpAddress, endIndexForIpAddress).replace('address', '').trim();
        // this line to get static netmask address for port 1 on load
        const startIndexForNetmaskAddress = dataForPortX1P1.indexOf('netmask 255');
        const endIndexForNetmaskAddress = dataForPortX1P1.indexOf('auto eth1');
        this.netMaskIpAddress = dataForPortX1P1.substring(startIndexForNetmaskAddress, endIndexForNetmaskAddress).replace('netmask', '').trim();
        // assigning the ip and netmask address to a variable
        this.netMaskAddress = this.netMaskIpAddress;
        this.staticAddtess = this.staticIpAddress;
      } else {
        // this line is for port 1 disable if static ip and netmask address is not available on load
        this.port1Checked = false;
        this.networkSettingsService.fieldDisable(this.port1ValidationForm, 'ipAddress', 'netMaskAddress');
        // empty the field if static ip and netmask address is not available on load
        this.staticIpAddress = '';
        this.netMaskIpAddress = '';
      }
      // string operation for getting ip address and netmask address for port 2 from the interface file
      if (this.port2ValidationText === -1) {
        // this line is for port 2 enable if static ip and netmask address is available on load
        this.port2Checked = true;
        this.networkSettingsService.fieldEnable(this.port2ValidationForm, 'ipAddress', 'netMaskAddress');
        // this line to get static netmask address for port 2 on load
        const dataForPortX2P1 = this.fullFileData.indexOf('iface eth1 inet static');
        const dataToBeChange = this.fullFileData.substring(dataForPortX2P1).replace('iface eth1 inet static', '').trim();
        // this line to get static ip address for port 2 on load
        const startIndex = dataToBeChange.indexOf('address');
        const endIndexPort2 = dataToBeChange.indexOf('netmask');
        this.ipPort2Address = dataToBeChange.substring(startIndex, endIndexPort2).replace('address', '').trim();
        this.portX2P1IpAddress = this.ipPort2Address;
        // this line to get static netmask address for port 2 on load
        this.netmaskPort2Address = dataToBeChange.substring(endIndexPort2).replace('netmask', '').trim();
        this.portX2P1NetmaskAddress = this.netmaskPort2Address;
      } else {
        // this line is for port 2 disable if static ip and netmask address is not available on load
        this.port2Checked = false;
        this.networkSettingsService.fieldDisable(this.port2ValidationForm, 'ipAddress', 'netMaskAddress');
        // empty the field if static ip and netmask address is not available on load
        this.ipPort2Address = '';
        this.netmaskPort2Address = '';
      }
    }, (error) => {
      this.networkSettingsService.fieldDisable(this.port1ValidationForm, 'ipAddress', 'netMaskAddress');
      this.networkSettingsService.fieldDisable(this.port2ValidationForm, 'ipAddress', 'netMaskAddress');
      this.port1Checked = false;
      this.port2Checked = false;
      this.isRebootIsAvailable = true;
    });
  }
  // if static addresses are available for port 1
  port1StaticAdrdress() {
    this.port1Text = 'static';
    this.addressport1Text = 'address';
    this.netmaskport1Text = 'netmask';
  }
  port1DhcpAddress() {
    this.port1Text = 'dhpc';
    this.addressport1Text = '';
    this.netmaskport1Text = '';
  }
  // if static addresses are available for port 2
  port2StaticAdrdress() {
    this.port2Text = 'static';
    this.addressport2Text = 'address';
    this.netmaskport2Text = 'netmask';
  }
  port2DhcpAddress() {
    this.port2Text = 'dhcp';
    this.addressport2Text = '';
    this.netmaskport2Text = '';
  }
  // function for view network file in front end
  getStaticInterfaceFileViewData() {
    this.networkSettingsService.getFullFileData().subscribe((fileData: any) => {
      this.fullFileData = fileData;
      this.isInterFaceFileIsAvailable = true;
      // string operation to split file data in format
      this.port1ValidationText = this.fullFileData.indexOf('iface eth0 inet static');
      this.port2ValidationText = this.fullFileData.indexOf('iface eth1 inet dhcp');
      this.etcText = this.getSubstring(0, this.getIndex('# The loopback interface'));
      this.theLoopbackText = this.getSubstring(this.getIndex('The') - 2, this.getIndex(' interface') + 10);
      this.autoLoText = this.getSubstring(this.getIndex('auto lo'), this.getIndex('o lo') + 4);
      this.ifaceLoText = this.getSubstring(this.getIndex('iface lo'), this.getIndex('t loopback') + 10);
      this.wiredInterfaceText = this.getSubstring(this.getIndex('W') - 2, this.getIndex('d interfaces') + 13);
      this.autoEtho0Text = this.getSubstring(this.getIndex('auto eth0'), this.getIndex('o eth0') + 7);
      this.ifaceEtho0Text = this.getSubstring(this.getIndex('iface eth0'), this.getIndex('eth0 inet') + 9);
      this.autoEtho1Text = this.getSubstring(this.getIndex('auto eth1'), this.getIndex('iface eth1'));
      // if condtion for port 1
      if (this.port1ValidationText !== -1) {
        this.port1StaticAdrdress();
      } else {
        this.port1DhcpAddress();
      }
      // if condtion for port 2
      if (this.port2ValidationText !== -1) {
        this.ifaceEtho1Text = this.getSubstring(this.getIndex('iface eth1'), this.getIndex('eth1 inet') + 9);
        this.port2DhcpAddress();
      } else {
        this.ifaceEtho1Text = this.getSubstring(this.getIndex('iface eth1'), this.getIndex('eth1 inet') + 9);
        this.port2StaticAdrdress();
      }
    }, (error) => {
      this.isInterFaceFileIsAvailable = false;
      this.addressport1Text = 'Interface file is not available!!!!';
    });
  }
  // static radio button operation for port 1
  onClickStaticPort1() {
    if (this.port1Checked === false) {
      this.port1Checked = true;
      this.staticIpAddress = this.staticAddtess;
      this.netMaskIpAddress = this.netMaskAddress;
      this.port1StaticAdrdress();
      this.networkSettingsService.fieldEnable(this.port1ValidationForm, 'ipAddress', 'netMaskAddress');
    }
  }
  // dhcp radio button operation for port 1
  onClickDhcpPort1() {
    if (this.port1Checked === true) {
      this.isSaveButtonDiable = false;
      this.port1Checked = false;
      this.staticIpAddress = '';
      this.netMaskIpAddress = '';
      this.port1DhcpAddress();
      this.networkSettingsService.fieldDisable(this.port1ValidationForm, 'ipAddress', 'netMaskAddress');
    }
  }
  // static radio button operation for port 2
  onClickStaticPort2() {
    if (this.port2Checked === false) {
      this.port2Checked = true;
      this.ipPort2Address = this.portX2P1IpAddress;
      this.netmaskPort2Address = this.portX2P1NetmaskAddress;
      this.port2StaticAdrdress();
      this.networkSettingsService.fieldEnable(this.port2ValidationForm, 'ipAddress', 'netMaskAddress');
    }
  }
  // dhcp radio button operation for port 2
  onClickDhcpPort2() {
    if (this.port2Checked === true) {
      this.onChangeOfIPForPort1();
      this.port2Checked = false;
      this.ipPort2Address = '';
      this.netmaskPort2Address = '';
      this.port2DhcpAddress();
      this.x2P1IpAddressErrorMsg = '';
      this.networkSettingsService.fieldDisable(this.port2ValidationForm, 'ipAddress', 'netMaskAddress');

    }
  }
  // this function for kill session after reboot
  killSession() {
    this.auth.user.IsloggedIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('accessRole');
  }
  // function for cancel the changes if user click on cancel button
  cancelBtn() {
    this.getStaticInterfaceFileViewData();
    this.getFileIpAndNetmaskAddressFromApi();
    this.isSaveButtonDiable = true;
  }
  // function for show interface file in front end popup
  viewInterfaceFile() {
    this.modalRef.show(this.interfaceFileViewRef);
  }
  // function for show reboot popup
  rebootConfirm() {
    this.rebootCofirm.show(this.rebootConfirmMsgView);
    if (this.staticIpAddress === '') {
      this.staticIpAddress = this.staticAddtess;
    }
    setTimeout(() => {
      this.killSession();
      window.location.href = 'https://' + this.staticIpAddress + '/login';
    }, 9000 * 60);
  }
  rebootConfirmation(rebootConfirmMsg) {
    // call reboot method
    this.networkSettingsService.getReboot().subscribe(res => {
    },
      (err) => {
        return err;
      });
    // reboot popup message
    this.rebootConfirmMsg = rebootConfirmMsg;
    setTimeout(() => {
      this.loaderService.display(false);
      this.rebootConfirm();
    }, 9000);
  }
  // function for call popup for reboot msg
  rebootDevice() {
    this.loaderService.display(true);
    // checking the dhcp condition
    // let confirmRebootMsg;
    if (this.staticIpAddress === '') {
      this.rebootConfirmMsg = 'Please contact to your DHCP administrator to get the IP /host name';
      this.rebootConfirmation(this.rebootConfirmMsg);
    } else {
      this.rebootConfirmMsg = 'Reboot sequence has initiated. Please wait for 10 minutes!!';
      this.rebootConfirmation(this.rebootConfirmMsg);
    }
  }


  // function for close the interface file view popup
  closeInterfaceFile() {
    this.modalRef.close();
  }
  // this function for error message for same ip address for both port
  onChangeOfX2P1IpAddress() {
    if (this.staticIpAddress === this.ipPort2Address && this.staticIpAddress !== '') {
      this.x2P1IpAddressErrorMsg = 'Ip address for both port should not be same';
      this.isSaveButtonDiable = true;
    } else {
      this.x2P1IpAddressErrorMsg = '';
      this.isSaveButtonDiable = false;
    }
    if (this.ipPort2Address === this.portX2P1IpAddress && this.netmaskPort2Address === this.portX2P1NetmaskAddress) {
      this.isSaveButtonDiable = true;
    } else {
      this.isSaveButtonDiable = false;
    }
  }
  // validation function for current and interface ip will same
  onChangeOfIPForPort1() {
    if (this.staticIpAddress === this.staticAddtess && this.netMaskIpAddress === this.netMaskAddress) {
      this.isSaveButtonDiable = true;
    } else {
      this.isSaveButtonDiable = false;
    }
  }
  rebootConfirmationMsg() {
    this.confirmMsgForRebootBtnRef.confirm().subscribe((isaccepted) => {
      if (isaccepted === true) {
        this.rebootDevice();
      } else {
        this.isNetworkChangeSaved = false;
      }
    },
      (err) => {
        return err;
      });
  }
}
