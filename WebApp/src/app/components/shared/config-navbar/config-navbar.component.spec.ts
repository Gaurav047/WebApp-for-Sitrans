import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigNavbarComponent } from './config-navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ConfigNavbarComponent test Suite:', () => {
  let component: ConfigNavbarComponent;
  let fixture: ComponentFixture<ConfigNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigNavbarComponent ],
      imports: [RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ConfigMenuObject check', () => {
    const configMenuObject =  [
      { name: 'Network Settings', link: 'networkSettings' },
      { name: 'Device / Channel Access', link: 'shieldChannelAccess' },
      { name: 'OPC UA', link: 'opcUa' },
      { name: 'System Settings', link: 'systemSettings' },
      { name: 'Task Manager', link: 'taskManager' },
    ];
    expect(component.configMenuObject).toEqual(configMenuObject);
  });
});
