import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '@app/model/user';
import { AppService } from '@app/services/shared/app.service';
export function existingUserIdValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control.value && control.value.length > 3) {
      return userService.getUserByUserId(control.value)
        .pipe(debounceTime(500),
          map(
            (user: any) => {
              return (user !== null) ? { 'appUserIdExists': true } : null;
            }
          ), catchError(() => null));
    }
    return Promise.resolve(null);
  };
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public users: any;

  constructor(private http: HttpClient, private appService: AppService) { }
  getUsersdetail() {
    return this.http.get<User[]>(`${this.appService.authServicesUrl}user/usersdetail`)
      .pipe(map((res: User[]) => {
        const data = res;
        this.users = res;
        this.users.forEach(element => {
          element.originalData = { ...element };
          element.isRoleChanged = false;
          element.isEditSelfEmailIdEnabled = false;
          element.isEditPhoneNoEnabled = false;
        });
        return this.users; // returning result to find the dirty bit;
      }));
  }
  getUserByUserId(userId: string) {
    const data = { 'userId': userId };
    const headerToBeSend = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.appService.authServicesUrl}user/getUserByUserId`, { headers: headerToBeSend, params: data });
  }
  updateUsersDetail(userdata) {
    return this.http.post<any>(`${this.appService.authServicesUrl}user/updateUsersDetail`, userdata)
      .pipe(map(data => {
        return data;
      }));
  }
  checkIfPasswordIsInValid(userdata) {
    const headerToBeSend = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${this.appService.authServicesUrl}auth/checkIfPasswordIsInValid`, { headers: headerToBeSend, params: userdata });
  }
  updateUserPassword(userdata) {
    return this.http.post<any>(`${this.appService.authServicesUrl}auth/updateUserPassword`, userdata)
      .pipe(map(data => {
        return data;
      }));
  }
  deleteUsers(userdata) {
    return this.http.post<any>(`${this.appService.authServicesUrl}user/deleteUsers`, userdata)
      .pipe(map(data => {
        return data;
      }));
  }
}
