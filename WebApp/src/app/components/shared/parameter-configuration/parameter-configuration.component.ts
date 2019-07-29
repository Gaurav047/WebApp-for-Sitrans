import { Component, OnInit, Input, Output } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import * as _ from 'lodash';
import { ParameterConfigurationService } from '@app/services/config-services/parameter-configuration.service';
import { AppService } from '@app/services/shared/app.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-parameter-configuration',
  templateUrl: './parameter-configuration.component.html',
  styleUrls: ['./parameter-configuration.component.scss']
})
export class ParameterConfigurationComponent implements OnInit {
  selectedNode: TreeModule[];
  cols: any[];
  frequencySelector: SelectItem[];
  @Input() configData;
  @Input() savedFrequency;
  @Output() disableSaveBtn: EventEmitter<boolean> = new EventEmitter();
  frequencyList: any;
  disableFrequency: boolean;
  @Output() setFrequencyValue: EventEmitter<any> = new EventEmitter();
  constructor(protected http: HttpClient, protected appService: AppService, protected parameterConfigurationService: ParameterConfigurationService) {
    this.frequencySelector = [];
    this.cols = [
      { field: 'name', header: 'Shield / Channel' },
      { field: 'size', header: 'Parameter' }
    ];
  }
  ngOnInit() {
    this.disableFrequency = false;
    this.frequencyListLabel();
    this.parameterConfigurationService.getConnectedShieldNames();
  }
  // values hardcoded for frequency that shoeld be sent to db
  frequencyListLabel() {
    this.frequencyList = [
      { value: null },
      { value: 600 },
      { value: 1200 },
      { value: 1800 },
      { value: 3600 }
    ];
    // creating the frequencySelector array to push the frequencyList object as label and value in frequencySelector to display the label in dropdown list
    this.frequencyList.forEach((element) => {
      element.label = this.displayFrequencyLabel(element.value).label;
      this.frequencySelector.push({ label: element.label, value: element.value });
    });
  }
  // label of the corresponsding value of frequency that should be displayed in UI
  displayFrequencyLabel(frequency) {
    // For displaying the frequency on load of screen(along with min or sec label) that is coming from database
    if (frequency !== undefined && frequency !== null) {
      if (frequency < 60) {
        return { label: frequency + ' sec', value: frequency };
      } else if (frequency >= 60) {
        return { label: (frequency) / 60 + ' min', value: frequency };
      }
    } else {
      return { label: 'Select', value: null };
    }
  }

  toggleDisplay(rowNode) {
    if (rowNode !== null && rowNode !== undefined && rowNode !== '') {
      return true;
    }
  }
  // disable all children if channel is disabled and vice versa
  onChanneltoggle(event, selectedNode) {
    this.disableSaveBtn.emit(false);
    selectedNode.node.data.isSelected = event.checked;
    for (const i in selectedNode.node.children) {
      if (i) {
        selectedNode.node.children[i].data.isSelected = selectedNode.node.data.isSelected;
        for (const j in selectedNode.node.children[i].children) {
          if (j) {
            selectedNode.node.children[i].children[j].data.isSelected = selectedNode.node.children[i].data.isSelected;
          }
        }
      }
    }
  }
  // disable all channel if all parameters are disabled

  onParamToggle(event, selectedNode) {
    this.disableSaveBtn.emit(false);
    selectedNode.node.data.isSelected = event.checked;
    if (selectedNode.node.data.isSelected === true && selectedNode.node.parent.data.isSelected === false) {
      selectedNode.node.parent.data.isSelected = true;
      selectedNode.node.parent.parent.data.isSelected = true;
    }
  }
  // an event will be generated from parent to display th elabel in child (dropdown) and the event will be passed into label change method
  onDropdownChange(event) {
    this.disableSaveBtn.emit(false);
    this.savedFrequency = event.value;
    this.setFrequencyValue.emit(event.value);
  }
}
