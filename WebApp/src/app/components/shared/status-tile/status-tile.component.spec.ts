import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTileComponent } from './status-tile.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { StatusBarService } from '@app/components/site-contents/status-bar/status-bar.service';
import { SitransListviewService } from '@app/components/site-contents/sitrans-listview/sitrans-listview.service';

describe('StatusTileComponent', () => {
  let component: StatusTileComponent;
  let fixture: ComponentFixture<StatusTileComponent>;
  let sitransListviewService: SitransListviewService;
  let statusBarService: StatusBarService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusTileComponent ],
      imports: [],
      providers: [HttpClient, HttpHandler, StatusBarService, SitransListviewService]
    })
    .compileComponents();
    sitransListviewService = TestBed.get(SitransListviewService);
    statusBarService = TestBed.get(StatusBarService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
