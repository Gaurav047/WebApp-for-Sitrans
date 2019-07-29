import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserComponent } from './add-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DisplayControlErrorComponent } from '@app/components/shared/display-control-error/display-control-error.component';
import {DropdownModule} from 'primeng/dropdown';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/dialog';
import {  HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/components/common/messageservice';


describe('AddUserComponent test Suite:', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, DropdownModule, ConfirmDialogModule, DialogModule, HttpClientModule, RouterTestingModule],
      declarations: [AddUserComponent, DisplayControlErrorComponent, ConfirmationDialogComponent],
      providers: [ConfirmationService, MessageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.addUser.valid).toBeFalsy();
  });
  it('username field validity', () => {
    const username = component.addUser.controls['username'];
    expect(username.valid).toBeFalsy();
  });
  it('email field validity', () => {
    const email = component.addUser.controls['email'];
    expect(email.valid).toBeTruthy();
  });
  it('email field validity', () => {
    const email = component.addUser.controls['email'];
    expect(email.valid).toBeTruthy();
  });
  it('role field validity', () => {
    const role = component.addUser.controls['role'];
    expect(role.valid).toBeFalsy();
  });
  it('scope field validity', () => {
    const phonenumber = component.addUser.controls['phonenumber'];
    expect(phonenumber.valid).toBeTruthy();
  });
  it('username field validity', () => {
    let errors = {};
    const username = component.addUser.controls['username'];
    errors = username.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('role field validity', () => {
    let errors = {};
    const role = component.addUser.controls['role'];
    errors = role.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  // it('check if email pattern is as expected', () => {
  //   let errors = {};
  //   const email = component.addUser.controls['email'];
  //   email.setValue('test');
  //   errors = email.errors || {};
  //   expect(errors['^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$']).toBeTruthy();
  // });
});
