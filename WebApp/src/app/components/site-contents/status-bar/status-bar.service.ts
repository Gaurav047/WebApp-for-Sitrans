import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusBarService {
  diagnosticStateCode: string | null;
  private _subject = new Subject<any>();

  constructor() { }
  detectDiagnosticStateTileClick(event) {
    this._subject.next(event);
  }

  get getDiagnosticStateChange$() {
    return this._subject.asObservable();
  }
}
