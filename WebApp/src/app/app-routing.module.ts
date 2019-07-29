import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashbaordComponent } from '@app/components/site-contents/dashbaord/dashbaord.component';
import { ConfigNavbarComponent } from '@app/components/shared/config-navbar/config-navbar.component';
import { DataLoggerConfigurationComponent } from '@app/components/site-contents/data-logger-configuration/data-logger-configuration.component';
import { MindConnectComponent } from './components/site-contents/mind-connect/mind-connect.component';
import { MindConnectOnboardingComponent } from './components/site-contents/mind-connect/mind-connect-onboarding/mind-connect-onboarding.component';
import { ShieldChannelAvailabilityComponent } from '@app/components/site-contents/shield-channel-availability/shield-channel-availability.component';
import { LoginComponent } from '@app/components/login/login.component';
import { UsersDetailComponent } from '@app/components/site-contents/users-detail/users-detail.component';
import { AuthGuard } from '@app/services/shared/auth.guard';
import { NetworkSettingsComponent } from '@app/components/site-contents/network-settings/network-settings.component';
import { OpcUaComponent } from './components/site-contents/opc-ua/opc-ua.component';
import { TaskManagerComponent } from './components/site-contents/task-manager/task-manager.component';
import { SystemSettingsComponent } from './components/site-contents/system-settings/system-settings.component';
import { DataViewerComponent } from './components/site-contents/data-viewer/data-viewer.component';

const routes: Routes = [
  // by default redirect the user to dashboard screen, in dashbaord screen there in authguard which will authenticate the users token is valid or not
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashbaordComponent },
  { path: 'usersDetail', component: UsersDetailComponent, canActivate: [AuthGuard] },
  {
    path: 'config', component: ConfigNavbarComponent, canActivate: [AuthGuard],
    children: [
      { path: 'networkSettings', component: NetworkSettingsComponent },
      { path: 'shieldChannelAccess', component: ShieldChannelAvailabilityComponent },
      { path: 'opcUa', component: OpcUaComponent, },
      { path: 'systemSettings', component: SystemSettingsComponent },
      { path: 'taskManager', component: TaskManagerComponent },
      { path: '', redirectTo: 'networkSettings', pathMatch: 'full' },
    ]
  },
  { path: 'dataViewer', component: DataViewerComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
