import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '@app/services/shared/loader.service';
import { NoaParameterViewService } from './noa-parameter-view.service';

@Component({
  selector: 'app-noa-parameters-view',
  templateUrl: './noa-parameters-view.component.html',
  styleUrls: ['./noa-parameters-view.component.scss'],
  providers: [NoaParameterViewService]
})
export class NoaParametersViewComponent implements OnInit {
  cols: any;
  detailDeviceData: any;
  @Input() params: any; // shield info  from the siwarex grid to send to the detailed view
  @Output() closeDetailView = new EventEmitter();
  showLoader: boolean; // screen loader
  constructor(public noaService: NoaParameterViewService, private loaderService: LoaderService) { }

  ngOnInit() {
    this.cols = [{ field: 'label', header: 'Parameter' },
    { field: 'parameterValue', header: 'Value' }];
    this.getNodeIdsList();
    // code to subscrive the loader  service
    this.loaderService.detailViewstatus.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
  getNodeIdsList() {
    this.loaderService.displayDetailViewLoader(true);
    this.noaService.getNodeIdsList(this.params.deviceTypeID, this.params.deviceRevision, this.params.manufacturerId).subscribe(res => {
      if (res !== undefined && res.body !== undefined) {
        const noaResult = JSON.parse(res.body);
        if (noaResult.NOAParameterList !== undefined) {
          const nodeIdList = noaResult.NOAParameterList.map(x => {
            return {
              nodeId: x.nodeID[0],
              parameter: x.ParameterID,
              displayName: x.DisplayValue
            };
          });
          this.getCommandsBasedOnNodeIds(nodeIdList);
        } else {
          // no noa parameter list
        }
      } else {
        // res undefined
      }
    }, err => {
      this.loaderService.displayDetailViewLoader(false);
    });
  }
  getCommandsBasedOnNodeIds(nodeIdList: any) {
    this.detailDeviceData = [];
    let completedRequests = 0;
    nodeIdList.forEach(item => {
      // fetching the node ids
      this.noaService.getCommandsBasedOnNodeIds(item.nodeId, this.params.deviceTypeID, this.params.deviceRevision, this.params.manufacturerId).subscribe((reusltByNodeId: any) => {
        if (reusltByNodeId !== undefined && reusltByNodeId.commandList.length !== 0) {
          // taking the first comand item from the commnad list
          const commandItem = reusltByNodeId.commandList.filter(x => {
            return (x.Type === 'READ');
          })[0];
          // callingthe coomand trigger api based on the command list
          this.noaService.getCommandResponse(this.params.shieldNumber, this.params.channelNumber, commandItem.HARTCommand, commandItem.TransactionNumber).subscribe(
            (cmdResponse: any) => {
              completedRequests++;
              if (cmdResponse !== undefined && cmdResponse.response !== undefined) {
                const cmdParameterObj = cmdResponse.response[item.parameter];
                if (cmdParameterObj !== undefined) {
                  const cmdData = { label: cmdParameterObj.parameterLabel, parameterValue: cmdParameterObj.displayValue };
                  this.detailDeviceData.push(cmdData);
                } else {
                  const cmdErr = { label: item.displayName, parameterValue: 'Internal Server Error' };
                  this.detailDeviceData.push(cmdErr);
                }
              }
              this.stopLoader(completedRequests, nodeIdList.length);
            }, (err) => {
              completedRequests++;
              this.stopLoader(completedRequests, nodeIdList.length);
            });
        } else {
          // if the command list length is zero
          completedRequests++;
          this.stopLoader(completedRequests, nodeIdList.length);
        }
      }, (err) => {
        completedRequests++;
        this.stopLoader(completedRequests, nodeIdList.length);
      });
    });
  }
  // stop the loader of alll the requests are resolved
  stopLoader(completedRequests, nodeListLength) {
    if (completedRequests === nodeListLength) {
      // sort the list
      // this.detailDeviceData.sort((a, b) => b.name > a.name ? -1 : 1);
      this.loaderService.displayDetailViewLoader(false);
    }
  }
}
