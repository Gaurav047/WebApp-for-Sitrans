import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PickListModule } from 'primeng/picklist';
import { DropdownModule } from 'primeng/dropdown';
import { ResizableModule } from 'angular-resizable-element';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { AppRoutingModule } from './app-routing.module';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { SidebarModule } from 'primeng/sidebar';
import { AppComponent } from '@app/app.component';
import { HeaderComponent } from '@app/components/header-content/header/header.component';
import { NavigationbarComponent } from './components/header-content/navigationbar/navigationbar.component';
import { DashbaordComponent } from './components/site-contents/dashbaord/dashbaord.component';
import { ModalPopupComponent } from './components/shared/modal-popup/modal-popup.component';
import { DisplayControlErrorComponent } from './components/shared/display-control-error/display-control-error.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfigNavbarComponent } from './components/shared/config-navbar/config-navbar.component';
import { DropdownComponent } from './components/shared/dropdown/dropdown.component';
import { ParameterConfigurationComponent } from './components/shared/parameter-configuration/parameter-configuration.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TreeModule } from 'primeng/tree';
import { DatePipe, CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '@app/services/shared/auth.service';
import { AuthInterceptorService } from '@app/services/shared/auth-interceptor.service';
import { MindConnectComponent } from './components/site-contents/mind-connect/mind-connect.component';
import { DataLoggerConfigurationComponent } from './components/site-contents/data-logger-configuration/data-logger-configuration.component';
import { SideNavbarComponent } from './components/shared/side-navbar/side-navbar.component';
import { MindConnectOnboardingComponent } from '@app/components/site-contents/mind-connect/mind-connect-onboarding/mind-connect-onboarding.component';
import { ContentHostDirective } from '@app/directives/content-host.directive';
import { ShieldChannelAvailabilityComponent } from '@app/components/site-contents/shield-channel-availability/shield-channel-availability.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material';
import { LoginComponent } from '@app/components/login/login.component';
import { AddUserComponent } from '@app/components/site-contents/add-user/add-user.component';
import { UsersDetailComponent } from '@app/components/site-contents/users-detail/users-detail.component';
import { StatusBarComponent } from './components/site-contents/status-bar/status-bar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoaderService } from '@app/services/shared/loader.service';
import { MustMatchDirective } from '@app/directives/mustMatch.directive';
import { ToastComponent } from './components/shared/toast/toast.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { NetworkSettingsComponent } from './components/site-contents/network-settings/network-settings.component';
import { FileUploadModule } from 'primeng/fileupload';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DeviceDataService } from './services/shared/device-data.service';
import { SitransListviewComponent } from './components/site-contents/sitrans-listview/sitrans-listview.component';
import { DetailViewComponent } from './components/site-contents/detail-view/detail-view.component';
import { UniversalCommandViewComponent } from './components/site-contents/universal-command-view/universal-command-view.component';
import { NoaParametersViewComponent } from './components/site-contents/noa-parameters-view/noa-parameters-view.component';
import { StatusTileComponent } from './components/shared/status-tile/status-tile.component';
import { CalendarModule } from 'primeng/calendar';
import { OpcUaComponent } from './components/site-contents/opc-ua/opc-ua.component';
import { TaskManagerComponent } from './components/site-contents/task-manager/task-manager.component';
import { TooltipModule } from 'primeng/tooltip';
import { SystemSettingsComponent } from './components/site-contents/system-settings/system-settings.component';
import { DataViewerComponent } from './components/site-contents/data-viewer/data-viewer.component';
import { DateFormatPipe } from './pipes/dateFormat.pipe';
import { NoaParametersGroupViewComponent } from './components/site-contents/noa-parameters-group-view/noa-parameters-group-view.component';
import { DataAgoPipe } from './pipes/data-ago.pipe';
import { TabMenuModule } from 'primeng/tabmenu';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationbarComponent,
    DashbaordComponent,
    ModalPopupComponent,
    DisplayControlErrorComponent,
    ConfirmationDialogComponent,
    ConfigNavbarComponent,
    DropdownComponent,
    LoginComponent,
    AddUserComponent,
    UsersDetailComponent,
    ParameterConfigurationComponent, MindConnectComponent, DataLoggerConfigurationComponent, MustMatchDirective,
    SideNavbarComponent, MindConnectOnboardingComponent, ContentHostDirective, ShieldChannelAvailabilityComponent,
    StatusBarComponent, ToastComponent, NetworkSettingsComponent,
    MindConnectOnboardingComponent, ContentHostDirective, ShieldChannelAvailabilityComponent, StatusBarComponent,
    ToastComponent, NetworkSettingsComponent, SitransListviewComponent, DetailViewComponent, UniversalCommandViewComponent, NoaParametersViewComponent, StatusTileComponent, OpcUaComponent, TaskManagerComponent, SystemSettingsComponent, DataViewerComponent, DateFormatPipe, NoaParametersGroupViewComponent, DataAgoPipe
  ],
  imports: [
    BrowserModule,
    SidebarModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule,
    TreeTableModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFontAwesomeModule,
    AccordionModule,
    TabViewModule,
    SplitButtonModule,
    HttpClientModule, PickListModule,
    TableModule, OverlayPanelModule,
    DropdownModule, SidebarModule, ResizableModule, ConfirmDialogModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }), DialogModule, CommonModule,
    MultiSelectModule, TreeModule, TreeTableModule, CheckboxModule, PaginatorModule, MatSlideToggleModule, MatProgressBarModule, FileUploadModule,
    ToastModule, CalendarModule, TooltipModule, TabMenuModule
  ],
  providers: [DatePipe, AuthService, LoaderService, MessageService, DeviceDataService, ConfirmationService, DateFormatPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddUserComponent, NoaParametersViewComponent, NoaParametersGroupViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AppModule { }
