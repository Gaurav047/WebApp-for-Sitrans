import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services/shared/auth.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(private auth: AuthService, private router: Router) {

  }

  ngOnInit() {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.isTokenValid().pipe(map((res) => {
      if (res.status === 200 && this.auth.isUserAuthenticated && this.auth.isTokenExpired === false && this.auth.isNewUser === false) {
        return true;
      } else {
        this.auth.isValidLogin = false;
        // user is logged out if his/her token is invalid
        // a pop up should be shown to the user
        alert('Your session is expired.Please login again');
        this.auth.logout();
        return false;
      }
    }), catchError((err: any) => {
      alert('Your session is expired.Please login again');
      this.auth.logout();
      return throwError(false);
    }));
  }
}
