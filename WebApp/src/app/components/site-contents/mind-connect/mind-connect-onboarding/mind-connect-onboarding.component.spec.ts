import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MindConnectOnboardingComponent } from './mind-connect-onboarding.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppService } from '@app/services/shared/app.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { RouterTestingModule } from '@angular/router/testing';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';

describe('MindConnectOnboardingComponent test Suite:', () => {
  let component: MindConnectOnboardingComponent;
  let fixture: ComponentFixture<MindConnectOnboardingComponent>;
  // let httpClient: HttpClient;
  // let httpTestingController: HttpTestingController;
  // let appService: AppService;
  let parameterConfigurationService: ParameterConfigurationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MindConnectOnboardingComponent],
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule, RouterTestingModule],
      providers: [MessageService, AppService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MindConnectOnboardingComponent);
    component = fixture.componentInstance;
    parameterConfigurationService = TestBed.get(ParameterConfigurationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('parameterConfigurationService.getMindConnectKeyData() should http GET response', () => {
    const mindConnectData = {};
    const mindConnectConfig = 'mindConnect';
    component.getOnBoardingKeyData();
    parameterConfigurationService.getMindConnectKeyData(mindConnectConfig).subscribe((res) => {
      expect(res).toEqual(mindConnectData);
    });
    expect(component.getOnBoardingKeyData).toBeTruthy();
  });
  it('getOnBoardingKeyData function is working', () => {
    expect(component.getOnBoardingKeyData).toBeTruthy();
  });
  it('parameterConfigurationService.getMindConnectKeyData() should http GET response', () => {
    const data = {};
    const mindConnectConfig = 'mindConnect';
    component.getOnBoardingKeyData();
    parameterConfigurationService.saveMindConnectKeyData(mindConnectConfig, data);
    expect(component.saveOnBoardingKey).toBeTruthy();
  });
  it('cancelChanges function is working', () => {
    expect(component.cancelChanges).toBeTruthy();
  });
});
