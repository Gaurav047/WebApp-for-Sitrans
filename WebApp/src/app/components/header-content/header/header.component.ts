import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NavbarService } from '@app/services/navbar.service';
import { AuthService } from '@app/services/shared/auth.service';
import { AppService } from '@app/services/shared/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '@app/services/user.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  languageList: any;
  userProfileModel: any = { isProfileInEditMode: false, ischangePasswordClicked: false, isCurrentPasswordInvalidErr: false, language: { label: 'English', value: 'en' }, waitForPasswordVerifyMsg: false };
 // isUserValid: any;
  @ViewChild('f') profileForm: any;
 // public _isSessionValid: Subject<boolean> = new Subject<boolean>();
  constructor(private appservice: AppService, public navService: NavbarService, public auth: AuthService, private http: HttpClient, private userService: UserService) {
    this.navService.hamburgerIconVisible = true;
    this.navService.sideNavBarVisibility = false;
  }
  // function to open the side menu bar
  openNavBar() {
    this.navService.hamburgerIconVisible = !this.navService.hamburgerIconVisible;
    if (this.navService.hamburgerIconVisible === true) {
      this.navService.sideNavBarVisibility = false;
    } else {
      this.navService.sideNavBarVisibility = true;
    }
  }

  ngOnInit() {
    this.languageList = [{ label: 'English', value: 'en' }];
    // this.isUserValid = this.auth.isUserAuthenticated;
  //  this._isSessionValid.next(true);
  }
  // isSessionValid(): Observable<any> {
  //   return this._isSessionValid.asObservable();
  // }
  ngAfterViewInit() {
    // this.isSessionValid().subscribe(isSessionValid => {
    //   // if (isSessionValid === false) {
    //   //   alert('Your session is expired.Please login again');
    //   //   this.auth.logout();
    //   // }
    // });
  }

  // initial variable setting for the profile edit overlay
  loadSetting() {
    this.userProfileModel.isProfileInEditMode = false;
    this.userProfileModel.ischangePasswordClicked = false;
  }
  // on load function for the edit profile overlay
  getUserProfileByUserId() {
    const data = { userId: this.auth.loggedInUserId };
    const headerToBeSend = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get<any>(`${this.appservice.authServicesUrl}user/getUserProfileByUserId`, { headers: headerToBeSend, params: data })
      .subscribe((res) => {
        this.userProfileModel = res[0];
        this.userProfileModel.language = { label: 'English', value: 'en' };
        this.loadSetting();
        this.profileForm.submitted = false;
      });
  }
  /// on submitting the edit profile view or change password details
  onSubmit() {
    // if form in invalid return;
    if (!this.profileForm.valid === true) {
      return;
    }
    // if user is in chnage passowrd view
    if (this.userProfileModel.ischangePasswordClicked === true) {
      this.userProfileModel.waitForPasswordVerifyMsg = true;
      // data need to verify the current password is valid or not
      const currentPasswordData = { userId: this.userProfileModel.userId, password: window.btoa(this.userProfileModel.currentPassword) };
      // if user current password is valid only then proceed furthur for submit
      this.isUserPasswordValid(currentPasswordData).subscribe(isPasswordValid => {
        // setTimeout(() => {
        this.userProfileModel.waitForPasswordVerifyMsg = false;
        if (isPasswordValid) {
          this.userProfileModel.isCurrentPasswordInvalidErr = false;
          this.updateProfileIfFormValid();
        } else {
          // if current password is invalid throw error msg to user
          this.userProfileModel.isCurrentPasswordInvalidErr = true;
          return;
        }
        // }, 3000);
      });
    } else {
      // user is in udate profile view
      this.updateProfileIfFormValid();
    }

  }
  updateProfileIfFormValid() {
    const dataToSave = { emailId: this.userProfileModel.emailId, phoneNumber: this.userProfileModel.phoneNumber, userName: this.userProfileModel.userName, userId: this.userProfileModel.userId, confirmPassword: this.userProfileModel.confirmPassword };
    if (dataToSave.confirmPassword !== undefined && dataToSave.confirmPassword !== null && dataToSave.confirmPassword !== '') {
      dataToSave.confirmPassword = window.btoa(this.userProfileModel.confirmPassword);

    }
    this.http.post<any>(`${this.appservice.authServicesUrl}auth/updateUserProfile`, dataToSave)
      .subscribe((res) => {
        this.loadSetting();
        this.clearChangePasswordObject();
        // if the user chnages user  setting from users page then on close of the pop up the chnages should be refelected
        this.userService.getUsersdetail().subscribe();
      });
  }
  // function to check if the user current password is valid
  isUserPasswordValid(data): Observable<any> {
    return this.http.post<any>(`${this.appservice.authServicesUrl}auth/isUserPasswordValid`, data)
      .pipe(map((res) => {
        return res;
      }));
  }
  // on click of edit profile link
  goToEditMode(event) {
    event.stopPropagation();
    this.userProfileModel.isProfileInEditMode = true;
  }
  // on click of chnage Password link
  goToChangePasswordMode(event) {
    event.stopPropagation();
    this.userProfileModel.ischangePasswordClicked = true;
    this.profileForm.reset();
  }
  // function on click of cancel button in the edit profile view
  cancelProfileEdit() {
    this.profileForm.resetForm();
    this.getUserProfileByUserId();
  }
  onLanguageSelectChange(event) {
  }
  resetErrorOnValueChange() {
    this.userProfileModel.isCurrentPasswordInvalidErr = false;
  }
  resetProfileViewonHide() {
    this.profileForm.submitted = false;
    this.userProfileModel.waitForPasswordVerifyMsg = false;
    this.loadSetting();
  }
  clearChangePasswordObject() {
    this.userProfileModel.currentPassword = '';
    this.userProfileModel.newPassword = '';
    this.userProfileModel.confirmPassword = '';
    this.profileForm.submitted = false;
  }
}
