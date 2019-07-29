import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from '@app/services/shared/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {

  }
  intercept(req, next) {
    const authservice = this.injector.get(AuthService);
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'token ' + authservice.token)
    });
    return next.handle(authRequest);
  }

}
