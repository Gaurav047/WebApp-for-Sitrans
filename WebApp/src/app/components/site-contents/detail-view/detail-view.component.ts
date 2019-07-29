import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { ContentHostDirective } from '@app/directives/content-host.directive';
import { DetailedDeviceDataService } from '@app/services/shared/detailed-device-data.service';
import { NoaParametersGroupViewComponent } from '../noa-parameters-group-view/noa-parameters-group-view.component';
@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @Input() params: any; // shield info  from the siwarex grid to send to the detailed view
  @Output() closeDetailView = new EventEmitter();
  @ViewChild(ContentHostDirective) entry: ContentHostDirective;
  selectedTabItem: any;
  detailViewTabItems: any;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, public detailViewService: DetailedDeviceDataService) { }

  ngOnInit() {
    this.detailViewTabItems = [{ id: 1, name: 'NOA Parameters' }];
    this.tabViewOnLoad();

  }
  /// on load of the detailed view show shield component;
  tabViewOnLoad() {
    this.selectedTabItem = this.detailViewTabItems[0];
    this.loadComponent(NoaParametersGroupViewComponent);
  }
  // onTabItemSelection(newItem) {
  //   // to highlight the selected Menu tab
  //   this.selectedTabItem = newItem;
  //   // to load the corresponding components in to detailed view
  //   switch (newItem.id) {
  //     case 1: this.loadComponent(UniversalCommandViewComponent);
  //       break;
  //     case 2: this.loadComponent(NoaParametersViewComponent);
  //       break;
  //     default: this.loadComponent(UniversalCommandViewComponent);
  //       break;
  //   }
  // }
  loadComponent(component) {
    if (component) {
      let componentRef: any, componentFactory: any, viewContainerRef: any;
      componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      viewContainerRef = this.entry.viewContainerRef;
      viewContainerRef.clear();
      componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.params = this.params;
    }
  }
  // closeing the detailved view side bar
  closeSidebar() {
    this.closeDetailView.emit(false);
  }

}
