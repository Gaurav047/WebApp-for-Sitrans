import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSettingsComponent } from './network-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ModalPopupComponent } from '@app/components/shared/modal-popup/modal-popup.component';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NetworkSettingsService } from '@app/services/config-services/network-settings.service';
import { Observable, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NetworkSettingsComponent', () => {
  let component: NetworkSettingsComponent;
  let fixture: ComponentFixture<NetworkSettingsComponent>;
  class GetNetworkSettingsServiceStub {
    fullFileData;
    getFullFileData(): Observable<any> {
      this.fullFileData = '# /etc/network/interfaces -- configuration file for ifup(8),ifdown(8) # The loopback interface auto lo iface lo inet loopback # Wired interfaces auto eth0 iface eth0 inet static address 132.186.252.253 netmask 255.255.255.0 auto eth1 iface eth1 inet dhcp';
      return of(this.fullFileData);
    }
     // function for disable input field
  fieldDisable(formName, firstFieldName, seconFieldName) {
    const ipAddress = formName.get(firstFieldName);
    ipAddress.disable();
    const netmask = formName.get(seconFieldName);
    netmask.disable();
  }
  // function for enable input field
  fieldEnable(formName, firstFieldName, seconFieldName) {
    const ipAddress = formName.get(firstFieldName);
    ipAddress.enable();
    const netmask = formName.get(seconFieldName);
    netmask.enable();
  }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkSettingsComponent, ConfirmationDialogComponent, ModalPopupComponent],
      imports: [ReactiveFormsModule, ConfirmDialogModule, DialogModule, HttpClientModule, RouterTestingModule],
      providers: [ConfirmationService, { provide: NetworkSettingsService, useClass: GetNetworkSettingsServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ipaddress field validity for port 1', () => {
    const ipAddress = component.port1ValidationForm.controls['ipAddress'];
    expect(ipAddress.valid).toBeTruthy();
  });
  it('netmaskAddress field validity for port 1', () => {
    const netMaskAddress = component.port1ValidationForm.controls['netMaskAddress'];
    expect(netMaskAddress.valid).toBeTruthy();
  });
  it('ipaddress field validity for port 2', () => {
    const ipAddress = component.port2ValidationForm.controls['ipAddress'];
    expect(ipAddress.valid).toBeFalsy();
  });
  it('netmaskAddress field validity for port 2', () => {
    const netMaskAddress = component.port2ValidationForm.controls['netMaskAddress'];
    expect(netMaskAddress.valid).toBeFalsy();
  });
  it('InterFace File data from API ', () => {
    const fullFileData1 = '# /etc/network/interfaces -- configuration file for ifup(8),ifdown(8) # The loopback interface auto lo iface lo inet loopback # Wired interfaces auto eth0 iface eth0 inet static address 132.186.252.253 netmask 255.255.255.0 auto eth1 iface eth1 inet dhcp';
    expect(component.fullFileData).toEqual(fullFileData1);
  });
  it('ipAddress for port 1', () => {
    // const netMaskAddress = getUserService.;
    const ipAddress = '132.186.252.253';
    expect(component.staticIpAddress).toEqual(ipAddress);
  });
  it('netMaskAddress for port 1', () => {
    const netMaskAddress = '255.255.255.0';
    expect(component.netMaskIpAddress).toEqual(netMaskAddress);
  });
  it('ipAddress for port 2', () => {
    // const netMaskAddress = getUserService.;
    const ipAddress = '';
    expect(component.ipPort2Address).toEqual(ipAddress);
  });
  it('netMaskAddress for port 2', () => {
    const netMaskAddress = '';
    expect(component.netmaskPort2Address).toEqual(netMaskAddress);
  });
  it('netMaskAddress for port 2', () => {
    const netMaskAddress = '';
    expect(component.netmaskPort2Address).toEqual(netMaskAddress);
  });
});
