import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() option: any;
  @Input() selectedValue: any = '';
  @Output() SelectDropdownEvent = new EventEmitter();
  @Input() disableButton?: any;
  @Input() hoverTitle: string;
  constructor() {
  }

  ngOnInit() {
  }
  // Emitting the item value on select dropdown
  onSelectDropdown(item) {
    this.SelectDropdownEvent.emit(item);
  }
}
