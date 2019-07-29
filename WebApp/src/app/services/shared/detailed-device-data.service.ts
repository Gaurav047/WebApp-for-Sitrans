import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class DetailedDeviceDataService {
  errors: any;
  constructor(protected auth: AuthService) {
    this.errors = { noChangesToSaveErr: false };
  }

  // for sleecting appropriate status classes
  getStatusClass(status) {
    switch (status) {
      case 'Good': return 'statusGood';
      case 'Bad': return 'statusBad';
      default: return 'statusNone';
    }
  }

  hasEditAccess() {
    return this.auth.hasEditAccess;
  }
}
