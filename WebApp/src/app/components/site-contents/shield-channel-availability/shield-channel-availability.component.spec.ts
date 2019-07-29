import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ShieldChannelAvailabilityComponent } from './shield-channel-availability.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSlideToggleModule, MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
// import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('ShieldChannelAvailabilityComponent', () => {
  let component: ShieldChannelAvailabilityComponent;
  let fixture: ComponentFixture<ShieldChannelAvailabilityComponent>;
  class GetNetworkSettingsServiceStub {

  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShieldChannelAvailabilityComponent],
      imports: [ReactiveFormsModule, FormsModule, MatSlideToggleModule, HttpClientModule, RouterTestingModule],
      providers: [MatSlideToggle, { provide: MatSlideToggleChange, useClass: GetNetworkSettingsServiceStub }, MessageService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShieldChannelAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
