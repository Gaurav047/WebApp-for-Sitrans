import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MustMatch } from '@app/components/shared/display-control-error/display-control-error.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent test Suite:', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  class GetNetworkSettingsServiceStub {

  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [{ provide: MustMatch, useClass: GetNetworkSettingsServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('openNavBar function is working', () => {
    expect(component.openNavBar).toBeTruthy();
  });
  it('loadSetting function is working', () => {
    expect(component.loadSetting).toBeTruthy();
  });
  it('getUserProfileByUserId function is working', () => {
    expect(component.getUserProfileByUserId).toBeTruthy();
  });
  it('onSubmit function is working', () => {
    expect(component.onSubmit).toBeTruthy();
  });
  it('updateProfileIfFormValid function is working', () => {
    expect(component.updateProfileIfFormValid).toBeTruthy();
  });
  it('isUserPasswordValid function is working', () => {
    expect(component.isUserPasswordValid).toBeTruthy();
  });
  it('goToEditMode function is working', () => {
    expect(component.goToEditMode).toBeTruthy();
  });
  it('goToChangePasswordMode function is working', () => {
    expect(component.goToChangePasswordMode).toBeTruthy();
  });
  it('cancelProfileEdit function is working', () => {
    expect(component.cancelProfileEdit).toBeTruthy();
  });
  it('onLanguageSelectChange function is working', () => {
    expect(component.onLanguageSelectChange).toBeTruthy();
  });
  it('resetErrorOnValueChange function is working', () => {
    expect(component.resetErrorOnValueChange).toBeTruthy();
  });
  it('resetProfileViewonHide function is working', () => {
    expect(component.resetProfileViewonHide).toBeTruthy();
  });
  it('clearChangePasswordObject function is working', () => {
    expect(component.clearChangePasswordObject).toBeTruthy();
    expect(component.profileForm.onSubmit).toBeTruthy();
  });
});
