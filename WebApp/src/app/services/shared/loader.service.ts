import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public detailViewstatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
  display(value: boolean) {
    this.status.next(value);
  }
  showLoader$() {
    return this.status.asObservable();
  }
  // for detailed view
  displayDetailViewLoader(value: boolean) {
    this.detailViewstatus.next(value);
  }
  showDetailViewLoader$() {
    return this.detailViewstatus.asObservable();
  }
}
