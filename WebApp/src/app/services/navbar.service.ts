import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private isSideNavBarVisible: boolean;
  private isHamburgerIconVisible: boolean;
  constructor() {
  }
  set hamburgerIconVisible(val: boolean, ) {
    this.isHamburgerIconVisible = val;
  }
  get hamburgerIconVisible() {
    return this.isHamburgerIconVisible;
  }
  set sideNavBarVisibility(val: boolean, ) {
    this.isSideNavBarVisible = val;
  }
  get sideNavBarVisibility() {
    return this.isSideNavBarVisible;
  }
}
