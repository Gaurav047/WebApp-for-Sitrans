import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationbarComponent } from './navigationbar.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarModule } from 'primeng/sidebar';
import { DisplayControlErrorComponent } from '@app/components/shared/display-control-error/display-control-error.component';
import { HttpClientModule } from '@angular/common/http';

describe('NavigationbarComponent test Suite:', () => {
  let component: NavigationbarComponent;
  let fixture: ComponentFixture<NavigationbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationbarComponent, DisplayControlErrorComponent],
      imports: [RouterTestingModule, FormsModule, SidebarModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('closeSideBar function is working', () => {
    expect(component.closeSideBar).toBeTruthy();
  });
  it('navService function is working', () => {
    expect(component.navService).toBeTruthy();
  });
  it('NavBarObject check', () => {
    const navBarobject = [
      {
        name: 'Dashboard', link: 'dashboard', borderClass: 'topBorderOfNavigation',
        src: '../../../../assets/images/Menu - Dashboard icon.png'
      },
      { name: 'User Management', link: 'usersDetail', icon: 'fa fa-user', borderClass: 'topBorderOfNavigation' },
      {
        name: 'Configuration', link: 'config/networkSettings', borderClass: 'bottomBorderOfNavigation topBorderOfNavigation',
        src: '../../../../assets/images/Menu - confifuration icon.png'
      },
      { name: 'Data Viewer', link: 'dataViewer', borderClass: 'topBorderOfNavigation', src: '../../../../assets/images/Datalogger.png' }
      // { name: 'Update Firmware', link: 'firmwareUpdate', src: '../../../../assets/images/Menu - update firmware icon.png', borderClass: 'topBorderOfNavigation' }
    ];
    expect(component.navMenuObject).toEqual(navBarobject);
  });
});
