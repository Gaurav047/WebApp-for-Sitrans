import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() header: string;
  @Input() icon: string;
  @Input() message: string;
  @Input() key: string;
  constructor(private confirmationService: ConfirmationService) {
  }
  ngOnInit() {
  }
  public confirm() {
    const confirmationAcceptedSubject = new Subject<boolean>();
    let msgs; /// changed the declaration of msgs
    this.confirmationService.confirm({
      message: this.message,
      header: this.header,
      icon: this.icon,
      key: this.key,
      accept: () => {
        msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' }];
        confirmationAcceptedSubject.next(true);
        // this.rebootNetworkSetting
      },
      reject: () => {
        msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        confirmationAcceptedSubject.next(false);

      }
    });
    return confirmationAcceptedSubject.asObservable();
  }
}
