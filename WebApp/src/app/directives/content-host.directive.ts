import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appContentHost]'
})
export class ContentHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
