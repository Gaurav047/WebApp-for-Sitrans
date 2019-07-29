import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewComponent } from './detail-view.component';
import { UniversalCommandViewComponent } from '@app/components/site-contents/universal-command-view/universal-command-view.component';
import { DropdownComponent } from '@app/components/shared/dropdown/dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { UniversalCommandViewService } from '@app/components/site-contents/universal-command-view/universal-command-view.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ContentHostDirective } from '@app/directives/content-host.directive';
import { DatePipe } from '@angular/common';

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;
  let universalCommandViewService: UniversalCommandViewService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewComponent, UniversalCommandViewComponent, DropdownComponent, ContentHostDirective],
      imports: [RouterTestingModule, ReactiveFormsModule, FormsModule, CalendarModule, TableModule],
      providers: [HttpClient, HttpHandler, UniversalCommandViewService, DatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }),
      TestBed.overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [UniversalCommandViewComponent]
        }
      })
        .compileComponents();
    universalCommandViewService = TestBed.get(UniversalCommandViewService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
