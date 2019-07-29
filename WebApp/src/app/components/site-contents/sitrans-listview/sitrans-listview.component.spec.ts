import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitransListviewComponent } from './sitrans-listview.component';
import { TableModule } from 'primeng/table';
import { SideNavbarComponent } from '@app/components/shared/side-navbar/side-navbar.component';
import { SidebarModule } from 'primeng/sidebar';
import { DetailViewComponent } from '@app/components/site-contents/detail-view/detail-view.component';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('SitransListviewComponent', () => {
  let component: SitransListviewComponent;
  let fixture: ComponentFixture<SitransListviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SitransListviewComponent, SideNavbarComponent, DetailViewComponent, ConfirmationDialogComponent],
      imports: [TableModule, SidebarModule, ConfirmDialogModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [ConfirmationService, HttpClient, HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitransListviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
