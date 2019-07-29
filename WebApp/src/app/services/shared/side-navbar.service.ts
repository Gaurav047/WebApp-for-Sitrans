import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavbarService {
  private isSideNavbarVisible = new Subject<boolean>();
  constructor() { }
  // openSideNavBar(event: boolean) {
  //   this.isSideNavbarVisible.next(event);
  // }
  // get sideNavVisisbility() {
  //   return this.isSideNavbarVisible.asObservable();
  // }
  openDetailViewSideNavBar(event: boolean) {
    this.isSideNavbarVisible.next(event);
  }
  get detailViewSideNavVisisbility() {
    return this.isSideNavbarVisible.asObservable();
  }
}
