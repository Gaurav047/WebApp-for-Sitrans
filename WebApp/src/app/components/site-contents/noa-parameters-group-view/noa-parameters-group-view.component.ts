import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { NoaParametersGroupViewService } from './noa-parameters-group-view.service';
import { tap, flatMap, map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { forkJoin, of } from 'rxjs';
import { LoaderService } from '@app/services/shared/loader.service';
@Component({
  selector: 'app-noa-parameters-group-view',
  templateUrl: './noa-parameters-group-view.component.html',
  styleUrls: ['./noa-parameters-group-view.component.scss']
})
export class NoaParametersGroupViewComponent implements OnInit {
  menuItems: any;
  noaParameterList: TreeNode[];
  showLoader: boolean; // screen loader
  selectedTabItem: any;
  cols: any;
  @Input() params: any; // shield info  from the siwarex grid to send to the detailed view
  constructor(private noaGroupVewService: NoaParametersGroupViewService, private loaderService: LoaderService) {
    this.noaParameterList = [];
  }
  ngOnInit() {
    this.cols = [
      { field: 'parameterLabel', header: 'Parameter Name' },
      { field: 'value', header: 'Value' },
    ];
    // code to subscrive the loader  service
    this.loaderService.detailViewstatus.subscribe((val: boolean) => {
      this.showLoader = val;
    });
    // call to menu item and converting the observable to promise.
    this.getNoaGroupingMenus().toPromise().then(menus => {
      if (menus !== undefined && menus.length > 0) {
        // on load ,activate the first tab item
        this.selectedTabItem = menus[0];
        this.getNoaGroupingItems(menus[0].label, undefined);
      } else {
        // service down message
      }
    }).catch(err => {
      this.loaderService.displayDetailViewLoader(false);
      return err;
    });

  }

  // call to menu item which will give the main menu items
  getNoaGroupingMenus() {
    this.loaderService.displayDetailViewLoader(true);
    return this.noaGroupVewService.getNoaGroupItems(this.params.deviceTypeID, this.params.deviceRevision, this.params.manufacturerId, 'root')
      .pipe(
        map((menuData: any) => {
          //  mapping menudata for data binding to the ui tab menu
          if (menuData !== undefined && menuData.length > 0) {
            this.menuItems = menuData.map((x, index) => {
              return { 'id': index, 'label': x.elementName };
            });
          }
          return this.menuItems;
        }));
  }
  // function to get the nested structure
  getNoaGroupingItems(groupItem, node) {
    this.loaderService.displayDetailViewLoader(true);
    // calling the first level of items.
    this.noaGroupVewService.getNoaGroupItems(this.params.deviceTypeID, this.params.deviceRevision, this.params.manufacturerId, groupItem)
      .pipe(
        flatMap(noaData => {
          const observables = noaData.filter(y => y.type !== 'parent').map(x => {
            return this.getCommandResponseData(x.elementName, this.params.deviceTypeID, this.params.deviceRevision, this.params.manufacturerId);
          });
          return forkJoin(observables.concat(of(noaData)));
        })
      ).subscribe((result: any) => {
        this.constructTreeTableData(result, groupItem, node);
      }, err => {
        this.loaderService.displayDetailViewLoader(false);
        return err;
      });
  }
  // To construct tree view
  constructTreeTableData(result, groupItem, node) {
    // node is defined when it is through expansion
    if (node !== undefined) {
      this.bindDataToGrid(result, node, 1, groupItem);
    } else {
      this.bindDataToGrid(result, this.noaParameterList, 0, groupItem);
    }
  }
  // Note: param should be replaced by pass by reference
  bindDataToGrid(result, node, param, groupItem) {
    // array is ordered so that its easy to bind with respect to the forkjoin result set
    const nodeElements = _.orderBy(_.last(result), ['type'], ['asc']);
    // 0 indicates data load During Menu click and not on expansion of node
    if (param === 0) {
      this.loaderService.displayDetailViewLoader(false);
      // if the item already exits then add the children to that list otherwise create a new data branch
      this.noaParameterList = nodeElements.map((x, i) => {
        return {
          data: {
            parameterName: x.elementName,
            value: (result[i] !== undefined && result[i] !== 'error' && result[i].response !== undefined && result[i].response[x.elementName] !== undefined)
            ? result[i].response[x.elementName].displayValue : '-',
            parameterLabel: (result[i] !== undefined && result[i] !== 'error' && result[i].response !== undefined && result[i].response[x.elementName] !== undefined)
            ? result[i].response[x.elementName].parameterLabel : x.elementName,
            isLoaded: true,
            type: x.type
          },
          children: x.type === 'parent' ? [{
            data: {
              parameterName: x.elementName,
              value: '-',
              parameterLabel: x.elementName,
              isLoaded: false,
              type: x.type
            }
          }] : null
        };
      });
    } else {
      this.loaderService.displayDetailViewLoader(false);
      // // adding data through node(via expansion), just keep adding children neednot check for existence of "GroupItem"
      // // used for Change Detectection of tree grid as per the prime ng documentation
      // const parentNodeList: any = [...this.noaParameterList];
      node.children = nodeElements.map((x, i) => {
        if (x.type !== 'parent') {
          return {
            data: {
              parameterName: x.elementName,
              value: (result[i] !== undefined && result[i] !== 'error' && result[i].response !== undefined && result[i].response[x.elementName] !== undefined)
              ? result[i].response[x.elementName].displayValue : '-',
              parameterLabel: (result[i] !== undefined && result[i] !== 'error' && result[i].response !== undefined && result[i].response[x.elementName] !== undefined)
              ? result[i].response[x.elementName].parameterLabel : x.elementName,
              isLoaded: true,
              type: x.type
            }
          };
        } else {
          return {
            data: {
              parameterName: x.elementName,
              value: '-',
              parameterLabel: x.elementName,
              isLoaded: false,
              type: x.type
            }, children: [
              {
                data: {
                  parameterName: x.elementName,
                  value: '-',
                  parameterLabel: x.elementName,
                  isLoaded: false,
                  type: x.type
                }
              }
            ]
          };
        }
      });
      // used for Change Detectection of tree grid as per the prime ng documentation
      this.noaParameterList = [...this.noaParameterList];
    }
  }
  onNodeExpand(e) {
    const groupItem = e.node.data.parameterName;
    this.getNoaGroupingItems(groupItem, e.node);
  }
  getCommandResponseData(parameter, deviceTypeId, deviceRevision, ManufacturerId) {
    let command: number;
    let transaction: number;
    return this.getCommandList(parameter, deviceTypeId, deviceRevision, ManufacturerId)
      .pipe(tap((commandListRes: any) => {
        if (commandListRes !== undefined && commandListRes.commandList !== undefined && commandListRes.commandList.length > 0) {
          command = commandListRes.commandList[0].HARTCommand;
          transaction = commandListRes.commandList[0].TransactionNumber !== undefined ? commandListRes.commandList[0].TransactionNumber : 0;
        }
      }), flatMap(y => {
        return this.getCommandResponseResult(this.params.shieldNumber, this.params.channelNumber, command, transaction);
      })
      );
  }
  getCommandResponseResult(shieldNumber, channelNumber, command, transaction) {
    return this.noaGroupVewService.getCommandResponse(shieldNumber, channelNumber, command, transaction).pipe(map((res) => res), catchError(e => of('error')));
  }
  getCommandList(parameter, deviceTypeId, deviceRevision, ManufacturerId) {
    return this.noaGroupVewService.getCommandsBasedOnParams(parameter, deviceTypeId, deviceRevision, ManufacturerId).pipe(map((res) => res), catchError(e => of('error')));
  }
  onTabItemSelection(selectedItem) {
    this.selectedTabItem = selectedItem;
    this.noaParameterList = [];
    this.getNoaGroupingItems(selectedItem.label, undefined);
  }
}
