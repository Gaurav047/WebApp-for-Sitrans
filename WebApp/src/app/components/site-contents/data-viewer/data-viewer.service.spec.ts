import { TestBed, async } from '@angular/core/testing';

import { DataViewerService } from './data-viewer.service';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { AppService } from '@app/services/shared/app.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DataViewerService', () => {
  let httpClient: HttpClient;
  let httpHandler: HttpHandler;
  let appService: AppService;
  class HandlerStub {
    handle(){
      const array =[];
      return array;
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule],
    providers: [HttpClient, {provide: HttpHandler, useClass: HandlerStub }],
    schemas: [NO_ERRORS_SCHEMA]

  }).compileComponents();
    httpClient = TestBed.get(HttpClient);
    appService = TestBed.get(AppService);
  }));

it('should be created', () => {
  const service: DataViewerService = TestBed.get(DataViewerService);
  expect(service).toBeTruthy();
});
});
