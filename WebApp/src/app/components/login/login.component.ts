import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService, invalidUserId } from '@app/services/shared/auth.service';
import { UserService } from '@app/services/user.service';
import { ModalPopupComponent } from '@app/components/shared/modal-popup/modal-popup.component';
import { ModalService } from '@app/services/shared/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  // passwordChangeForm: FormGroup;
  isformSubmitted = false;
  session: any;
  invalidPassword: boolean;
  enableLoginbtn: boolean;
  isUserPasswordSubmit: boolean;
  welcomeUserObj: any;
  isloggedIn = false;
  languageList = [{ label: 'English', value: 'en' }];
  errors: any;
  loginFormData: any;
  @ViewChild('modalRef') modalRef: ModalPopupComponent;
  @ViewChild('WelcomeView') welcomeViewRef: TemplateRef<any>;
  @ViewChild('changePassword') changePasswordRef: TemplateRef<any>;
  @ViewChild('pf') passwordChangeForm: any;
  @ViewChild('f') LoginDataForm: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userservice: UserService,
    private modalService: ModalService) {

  }

  ngOnInit() {
    this.initialiseErrorObject();
    this.enableLoginbtn = true;
    this.loginFormData = { userId: null, password: null };
  }
  initialiseErrorObject() {
    this.errors = { invalidPassword: false, invalidUserId: false, userAlreadyLoggedIn: false, maxUsersExceeded: false, loginApiError: false };
  }
  // function if validate sthe user login
  loginUserToApplication() {
    this.isformSubmitted = true;
    // stop here if form is invalid
    if (!this.LoginDataForm.valid === true) {
      return;
    } else {
      this.enableLoginbtn = false;
      this.loginFormData.password = window.btoa(this.loginFormData.password);
      this.authService.userLogin(this.loginFormData)
        .subscribe((res) => {
          this.enableLoginbtn = true;
          this.session = res;
          // If password is correct
          if (this.session.apiCode !== undefined && (this.session.apiCode.code === 2001 || this.session.apiCode.code === 2003) && (localStorage.getItem('token') !== null)) {
            this.errors.invalidPassword = false;
            this.isloggedIn = true;
            // if the logged in user has not chnaged the default password only then show password change pop up;
            if (this.session.isnewUser === 1) {
              this.userInitialSetup();
            } else {
              this.router.navigate(['dashboard']);
            }
          } else {
            this.errors.loginApiError = true;
          }
        }, (err) => {
          const errData = err.error;
          this.enableLoginbtn = true;
          if (errData.apiCode !== undefined) {
            switch (errData.apiCode.code) {
              case 1000: this.errors.invalidUserId = true;
                break;
              case 1002: this.errors.invalidPassword = true;
                break;
              case 2002: this.errors.userAlreadyLoggedIn = true;
                break;
              case 2004: this.errors.maxUsersExceeded = true;
                break;
              case 2005:
              case 2000: this.errors.loginApiError = true;
                break;
              default: this.errors.loginApiError = true;
                break;
            }
          } else {
            this.errors.loginApiError = true;
          }

        });
    }

  }
  // function to update user password
  updatePasswordOnFirstLogin() {
    this.isUserPasswordSubmit = true;
    // stop here if form is invalid
    if (this.passwordChangeForm.invalid) {
      return;
    } else {
      if (this.session.userId !== undefined && this.session.userId !== null) {
        const data = { userId: this.session.userId, password: window.btoa(this.passwordChangeForm.controls['confirmPassword'].value) };
        this.userservice.updateUserPassword(data).subscribe((res) => {
          // Navigate user to the dashboard Screen if he is password change is successfull.
          this.isUserPasswordSubmit = false;
          if (res === true) {
            // setting new user bit to 1 after he chnages the password
            localStorage.setItem('isNewUser', 'false');
            this.authService.isValidLogin = true;
            this.modalService.closeModal();
            this.router.navigate(['dashboard']);
          }
        });
      } else {
      }
    }

  }
  // on submiting the login button
  onSubmit() {
    this.loginUserToApplication();
  }
  // initial set up while logging in, open the welcome screen for the user
  userInitialSetup() {
    this.welcomeUserObj = { newPassword: '', confirmPassword: '', language: { label: 'English', value: 'en' } };
    this.modalRef.show(this.welcomeViewRef);
  }
  // save the language on changing the language option
  saveLanguageChanges() {
    this.modalService.closeModal();
    // open the changepassword form
    this.modalRef.show(this.changePasswordRef);

  }
  onLanguageSelectChange(event) {
  }
  isErrorInUserId(isformSubmitted, field) {
    if (isformSubmitted && (field.invalid || this.errors.invalidUserId)) {
      return true;
    } else {
      return false;
    }
  }
  isErrorInPassword(isformSubmitted, field) {
    if (isformSubmitted && (field.invalid || this.errors.invalidPassword || this.errors.userAlreadyLoggedIn || this.errors.maxUsersExceeded || this.errors.loginApiError)) {
      return true;
    } else {
      return false;
    }
  }
  onUserIdModelChange() {
    this.errors.invalidUserId = false;
  }
  onPasswordModelChange() {
    this.errors.invalidPassword = false;
    this.errors.userAlreadyLoggedIn = false;
    this.errors.maxUsersExceeded = false;
    this.errors.loginApiError = false;
  }
}
