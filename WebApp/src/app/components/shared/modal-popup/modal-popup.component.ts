import {
  Component, OnInit, ViewChild,
  Input, ComponentFactoryResolver
} from '@angular/core';
import { ContentHostDirective } from '@app/directives/content-host.directive';
import { ModalService } from '@app/services/shared/modal.service';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopupComponent implements OnInit {
  // display: boolean;
  componentRef: any;
  componentFactory: any;
  viewContainerRef: any;
  content: any;
  _id: any;
  @Input() visible: boolean;
  @Input() isDefaultBtnVisible: boolean; // initialize as throwing error
  @Input() isComponentLoad: boolean;
  @ViewChild(ContentHostDirective) entry: ContentHostDirective;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalService) {
    this.modalService.modalObservable.subscribe((event) => {
      // if(this._id == res.id)
      this.close(event);
    }, (err) => {
     return err;
    });
  }

  ngOnInit() {
    this.visible = false;
  }
  // if component is passed then laod the component or if template is passed the load the template
  public show(component) {
    this.visible = !this.visible;
    if (this.isComponentLoad === true) {
      this.loadComponent(component);
    } else {
      this.loadTemplate(component);
    }
  }
  public close(event?) {
    this.visible = (event !== undefined && event !== null) ? event : false;
  }
  loadComponent(component) {
    if (component) {
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.viewContainerRef = this.entry.viewContainerRef;
      this.viewContainerRef.clear();
      this.componentRef = this.viewContainerRef.createComponent(this.componentFactory);
    }
  }
  loadTemplate(template) {
    if (template) {
      this.content = template;
    }
  }
}
