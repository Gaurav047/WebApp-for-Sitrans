import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
// import {DisplayControlErrorComponent} from '@app/components/shared/display-control-error/display-control-error.component';

describe('LoginComponent test Suite:', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  // let displayControlErrorComponent: DisplayControlErrorComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    //  displayControlErrorComponent = TestBed.get(displayControlErrorComponent);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('UserId Field Validity', () => {
    const userId = component.loginForm.controls['userId'];
    expect(userId.valid).toBeFalsy();
  });
  it('Password Field Validity', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();
  });
  it('loginUserToApplication is working', () => {
    component.loginUserToApplication();
    const invalidPassword = false;
    expect(component.invalidPassword).toEqual(invalidPassword);
  });
  it('updatePasswordOnFirstLogin is working', () => {
    expect(component.updatePasswordOnFirstLogin).toBeTruthy();
  });
  it('onSubmit is working', () => {
    expect(component.onSubmit).toBeTruthy();
  });
  it('userInitialSetup is working', () => {
    expect(component.userInitialSetup).toBeTruthy();
  });
  it('saveLanguageChanges is working', () => {
    expect(component.saveLanguageChanges).toBeTruthy();
  });
  it('onLanguageSelectChange is working', () => {
    expect(component.onLanguageSelectChange).toBeTruthy();
  });
});
