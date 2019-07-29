import { Injectable, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppService } from '@app/services/shared/app.service';
import { UserService } from '@app/services/user.service';
import { LoaderService } from './loader.service';
import { ModalService } from './modal.service';

export function invalidUserId(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control.value && control.value.length > 4) {
      return userService.getUserByUserId(control.value)
        .pipe(debounceTime(500),
          map(
            (users: any) => {
              return (users === null) ? { 'invalidUserId': true } : null;
            }
          ), catchError(() => null));
    }
    return Promise.resolve(null);
  };
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;
  isValidLogin: boolean;
  constructor(private http: HttpClient,
    private appservice: AppService,
    private router: Router, private loader: LoaderService, private modal: ModalService) {
    this.user = { IsloggedIn: false };
    this.isValidLogin = true;
    // The storage event handler will only affect other windows. Whenever something changes in one window inside localStorage all the other windows are notified about it and if any action needs to be taken it can be achieved by a handler function listening to the storage event.
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        const token = localStorage.getItem('token');
        if (token === undefined || token === null) {
          // Logout form other tab
          this.unsetData(); // remove all running processes;
          this.router.navigate(['login']);
        } else if (token !== null && this.isTokenExpired === false) {
          this.router.navigate(['dashboard']);
        }
      }
    }, false);
    // if user is new user and refreshing the screen without changing the password, then he should be navigated to the login page
    if (window.performance && window.performance.navigation.type === 1) {
      if (this.isNewUser === true) {
        this.logout();
      }
    }
  }
  registerUser(userdata) {
    return this.http.post<any>(`${this.appservice.authServicesUrl}auth/registeruser`, userdata)
      .pipe(map(user => {
        return user;
      }));
  }
  userLogin(userdata) {
    return this.http.post<any>(`${this.appservice.authServicesUrl}auth/userlogin`, userdata)
      .pipe(map(authResult => {
        this.setSession(authResult);
        return authResult;
      }));
  }
  isUserExits() {
    const userdata = { userId: this.loggedInUserId };
    return this.http.post<any>(`${this.appservice.authServicesUrl}auth/isUserExists`, userdata)
      .pipe(map(user => {
        return user;
      }));
  }
  isFirstTimeLogin() {
    const userId = { userId: this.loggedInUserId };
    const headerToBeSend = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(`${this.appservice.authServicesUrl}auth/isFirstTimeLogin`, { headers: headerToBeSend, params: userId })
      .pipe(map(authResult => {
        this.setSession(authResult);
        return authResult;
      }));
  }
  // setting all the local storage variables
  private setSession(authResult) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('scope', authResult.accessRole);
    localStorage.setItem('userName', authResult.username);
    localStorage.setItem('userId', authResult.userId);
    localStorage.setItem('isNewUser', authResult.isnewUser === 1 ? 'true' : 'false');
  }

  get token() {
    return localStorage.getItem('token');
  }
  get loggedInUsername() {
    return localStorage.getItem('userName').toLowerCase();
  }
  get loggedInUserRole() {
    return localStorage.getItem('scope').toLowerCase();
  }
  get loggedInUserId() {
    return localStorage.getItem('userId');
  }
  get isNewUser() {
    return localStorage.getItem('isNewUser') === 'true' ? true : false;
  }

  // isUserIdValid() {
  //   this.isUserExits().subscribe(res => {
  //     localStorage.setItem('userExists', '1');
  //   }, err => {
  //     localStorage.setItem('userExists', '0');
  //   });
  // }
  
  get hasEditAccess() {
    if (localStorage.getItem('scope').toLowerCase() === 'admin' || localStorage.getItem('scope').toLowerCase() === 'write') {
      return true;
    } else {
      return false;
    }
  }
  get isAdmin() {
    if (localStorage.getItem('scope').toLowerCase() === 'admin') {
      return true;
    } else {
      return false;
    }
  }
  // checking token expiration
  get isTokenExpired() {
    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.token);
  }
  get isUserAuthenticated() {
    // a bit introduced to set isUserAuthenticated in the guard.
    if ((localStorage.getItem('token') !== 'null') && (localStorage.getItem('token') !== null) && this.isTokenExpired === false && this.isValidLogin === true) {
      this.user.IsloggedIn = true;
    } else { this.user.IsloggedIn = false; }
    return this.user.IsloggedIn;
  }
  // set isUserAuthenticated(value) {
  //   this.isValidLogin = value;
  // }
  isTokenValid() {
    return this.http.get(`${this.appservice.authServicesUrl}auth/checkIfTokenIsValid`, { observe: 'response' });
  }
  // function to logout the user from the screen
  logout() {
    this.loader.display(true);
    const userData = { userId: this.loggedInUserId };
    return this.http.post<any>(`${this.appservice.authServicesUrl}auth/logoutUser`, userData).subscribe(res => {
      this.loader.display(false);
      this.user.IsloggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('accessRole');
      this.router.navigate(['login']);
    }, err => {
      this.loader.display(false);
      return err;
    });
  }
  // remove all running processes in the another opened tab;
  unsetData() {
    // if there are any loader open in one tab and user is logging out from another tab, turn it off
    this.loader.showLoader$().subscribe(x => {
      if (x === true) {
        this.loader.display(false);
      }
    }, (err) => {
      return err;
    });
    // Close all the modals if they are open
    this.modal.closeModal(false);
    // setting the islogged in to false if the user is logout out from one session
    this.user.IsloggedIn = false;
    // to close the popovers
    document.body.click();
  }
  checkIfUserIdValid(userdata) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.appservice.authServicesUrl}auth/checkIfUserIdValid`, userdata);
  }
  get currentYear() {
    return (new Date()).getFullYear();
  }
}
