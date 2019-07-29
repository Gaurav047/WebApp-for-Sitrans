import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavbarComponent } from './side-navbar.component';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavbarService } from '@app/services/shared/side-navbar.service';
import { DetailViewComponent } from '@app/components/site-contents/detail-view/detail-view.component'

describe('SideNavbarComponent', () => {
  let component: SideNavbarComponent;
  let fixture: ComponentFixture<SideNavbarComponent>;
  let sideNavbarService: SideNavbarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavbarComponent, ConfirmationDialogComponent, DetailViewComponent],
      imports: [SidebarModule, ConfirmDialogModule, HttpClientModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [ConfirmationService, SideNavbarService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavbarComponent);
    component = fixture.componentInstance;
    sideNavbarService = TestBed.get(SideNavbarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('closeDetailViewConditionally function work', () => {
    const event = true;
    component.closeDetailViewConditionally(event);
    expect(component.closeDetailViewConditionally).toBeTruthy();
  });
  it('sideNavbarService.detailViewSideNavVisisbility function work', () => {
    const event1 = false;
    sideNavbarService.detailViewSideNavVisisbility.subscribe((event: boolean) => {
      const visisbility = event;
      expect(component.visibility).toEqual(visisbility);
    });
    expect(component.visibility).toEqual(event1);
  });
});
