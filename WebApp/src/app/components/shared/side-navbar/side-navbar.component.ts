import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SideNavbarService } from '@app/services/shared/side-navbar.service';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { DetailedDeviceDataService } from '@app/services/shared/detailed-device-data.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  visibility: boolean;
  @Input() params: any;
  @ViewChild('confirmOnDiscardChanges') confirmOnDiscardChangesRef: ConfirmationDialogComponent;

  constructor(private sideNavService: SideNavbarService, private detailedViewService: DetailedDeviceDataService) {
    this.visibility = false;
  }
  ngOnInit() {
    this.sideNavService.detailViewSideNavVisisbility.subscribe((event: boolean) => {
      this.visibility = event;
    }, (err) => {
     return err;
    });
  }
  closeDetailViewConditionally(event) {
    // if (event && event.isDetailViewClose === true) {
    //   if (this.detailedViewService.isEditSubmitEnabled === true && this.detailedViewService.isdataModified(event.data, event.dataCopy) !== 0) {
   //     this.confirmOnDiscardChangesRef.confirm().subscribe((isaccepted) => {
    //       if (isaccepted === true) {
    //         this.sideNavService.openDetailViewSideNavBar(true);
    //       } else {
    //         this.sideNavService.openDetailViewSideNavBar(false);
    //       }
    //     });
    //   } else if (this.detailedViewService.isEditSubmitEnabled === false && this.detailedViewService.pendingToWriteParaters.length !== 0) {
    //     this.confirmOnDiscardChangesRef.confirm().subscribe((isaccepted) => {
    //       if (isaccepted === true) {
    //         this.sideNavService.openDetailViewSideNavBar(false);
    //       } else {

    //       }
    //     });
    //   }else{
    //     this.sideNavService.openDetailViewSideNavBar(false);
    //   }
    // }
    this.sideNavService.openDetailViewSideNavBar(event);
  }

}
