import { Component, OnInit } from '@angular/core';
import { NavbarService } from '@app/services/navbar.service';
import { AuthService } from '@app/services/shared/auth.service';
import { BuildDetailsService } from '@app/services/config-services/build-details.service';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss']
})
export class NavigationbarComponent implements OnInit {
  navMenuObject: any;
  settingItems: any;
  buildDetails: any;
  constructor(public navService: NavbarService, public auth: AuthService, public buildDetailsService: BuildDetailsService) {
  }

  ngOnInit() {
    // Navigation menu Objects
    this.navMenuObject =
      [
        {
          name: 'Dashboard', link: 'dashboard', borderClass: 'topBorderOfNavigation',
          src: '../../../../assets/images/Menu - Dashboard icon.png'
        },
        { name: 'User Management', link: 'usersDetail', icon: 'fa fa-user', borderClass: 'topBorderOfNavigation' },
        {
          name: 'Configuration', link: 'config/networkSettings', borderClass: 'bottomBorderOfNavigation topBorderOfNavigation',
          src: '../../../../assets/images/Menu - confifuration icon.png'
        },
        // { name: 'Data Viewer', link: 'dataViewer', borderClass: 'topBorderOfNavigation', src: '../../../../assets/images/Datalogger.png' }
        // { name: 'Update Firmware', link: 'firmwareUpdate', src: '../../../../assets/images/Menu - update firmware icon.png', borderClass: 'topBorderOfNavigation' }
      ];
      this.buildDetails = { version: '', buildNumber: '', buildDate: '' };
  }
  displayBuildDetails() {
    this.getBuildDetails();
  }
  getBuildDetails() {
    this.buildDetailsService.getBuildDetails().subscribe((res: any) => {
      if (res !== undefined && res !== '') {
        this.buildDetails.version = res.substring(res.indexOf('Version'), res.indexOf('Build Number'));
        this.buildDetails.buildNumber = res.substring(res.indexOf('Build Number'), res.indexOf('Build date'));
        this.buildDetails.buildDate = res.substring(res.indexOf('Build date'), res.lastIndexOf(''));
      }
    });
  }
  closeSideBar() {
    this.navService.sideNavBarVisibility = false;
    this.navService.hamburgerIconVisible = true;
  }
}
