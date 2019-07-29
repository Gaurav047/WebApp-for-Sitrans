import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services/shared/auth.service';

@Component({
  selector: 'app-config-navbar',
  templateUrl: './config-navbar.component.html',
  styleUrls: ['./config-navbar.component.scss']
})
export class ConfigNavbarComponent implements OnInit {
  configMenuObject: any;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.configMenuObject = [
      { name: 'Network Settings', link: 'networkSettings' },
      { name: 'Device / Channel Access', link: 'shieldChannelAccess' },
      { name: 'OPC UA', link: 'opcUa' },
      { name: 'System Settings', link: 'systemSettings' },
      { name: 'Task Manager', link: 'taskManager' },
    ];
    // { name: 'MindConnect-Onboarding', link: 'mindConnectConfigOnboard' }];
  }
  get isAdmin() {
    return this.auth.isAdmin;
  }
}
