import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataViewerComponent } from './data-viewer.component';
import { TableModule } from 'primeng/table';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { DataViewerService } from './data-viewer.service';
import { AppService } from '@app/services/shared/app.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateFormatPipe } from '@app/pipes/dateFormat.pipe';


describe('DataViewerComponent', () => {
  let component: DataViewerComponent;
  let fixture: ComponentFixture<DataViewerComponent>;
  let dataViewerService: DataViewerService;
  let appService: AppService;
  let httpClient: HttpClient;
  class HandlerStub {
    handle() {
      const array = [];
      return array;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataViewerComponent],
      imports: [TableModule, HttpClientModule, RouterTestingModule],
      providers: [HttpClient, DataViewerService, { provide: HttpHandler, useClass: HandlerStub }, DatePipe, DateFormatPipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    dataViewerService = TestBed.get(DataViewerService);
    appService = TestBed.get(AppService);
    httpClient = TestBed.get(HttpClient);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
