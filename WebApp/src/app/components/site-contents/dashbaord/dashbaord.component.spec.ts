import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordComponent } from './dashbaord.component';
import { StatusBarComponent } from '@app/components/site-contents/status-bar/status-bar.component';
import { SitransListviewComponent } from '@app/components/site-contents/sitrans-listview/sitrans-listview.component';
import { StatusTileComponent } from '@app/components/shared/status-tile/status-tile.component';
import { TableModule } from 'primeng/table';
import { SideNavbarComponent } from '@app/components/shared/side-navbar/side-navbar.component';
import { SidebarModule } from 'primeng/sidebar';
import { DetailViewComponent } from '@app/components/site-contents/detail-view/detail-view.component';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashbaordComponent', () => {
  let component: DashbaordComponent;
  let fixture: ComponentFixture<DashbaordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashbaordComponent, StatusBarComponent, SitransListviewComponent, StatusTileComponent,
        SideNavbarComponent, DetailViewComponent, ConfirmationDialogComponent ],
      imports: [TableModule, SidebarModule, ConfirmDialogModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [ConfirmationService, HttpClient, HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
