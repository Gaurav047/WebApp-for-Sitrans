import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskManagerService } from './task-manager.service';
import { LoaderService } from '@app/services/shared/loader.service';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ToastMessageService } from '@app/services/shared/toast-message.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  taskManagerList: any;
  taskManagerListCopy: any;
  cols: any;
  noChangesToSaveErr: boolean;
  @ViewChild('confirmSaveAutoStart') public confirmSaveAutoStartRef: ConfirmationDialogComponent;
  constructor(private taskManagerService: TaskManagerService, private loader: LoaderService, private toastMessageService: ToastMessageService) {
    this.getTaskStatus();
  }
  ngOnInit() {
    this.cols = [{ header: 'Service Name', field: 'name' },
    { header: 'Status', field: 'status' },
    { header: 'Action', field: 'isServiceUp' }
    ];
    setInterval(() => {
      this.getTaskStatusOnInterval();
    }, 3 * 60 * 1000);
    this.noChangesToSaveErr = false;
  }
  getTaskStatus() {
    this.loader.display(true);
    this.taskManagerService.getTaskStatus().subscribe((taskStatus: any) => {
      this.loader.display(false);
      if (taskStatus !== undefined) {
        this.taskManagerList = taskStatus;
        this.taskManagerList.sort((a, b) => b.name > a.name ? -1 : 1);

      }
    }, (err) => {
      this.loader.display(false);
      return err;
    });
  }
  getTaskStatusOnInterval() {
    this.taskManagerService.getTaskStatus().subscribe((taskStatus: any) => {
      if (taskStatus !== undefined) {
        this.taskManagerList = taskStatus;
        this.taskManagerList.sort((a, b) => b.name > a.name ? -1 : 1);
        this.taskManagerListCopy = [...this.taskManagerList];
      }
    }, (err) => {
      this.loader.display(false);
      return err;
    });
  }
  setStatusBasedOnResult(task, result) {
    if (result !== undefined) {
      task.status = result.status;
      task.isServiceUp = result.isServiceUp;
      task.isError = result.isError;
    }
  }
  errStateResultObj() {
    return { status: 'Bad / Service is down', isServiceUp: false, isError: true };
  }
  stopService(task) {
    task.isExecutionCompleted = false;
    this.taskManagerService.stopService(task.port, task.serviceId).subscribe((result: any) => {
      task.isExecutionCompleted = true;
      this.setStatusBasedOnResult(task, result);
    }, (err) => {
      task.isExecutionCompleted = true;
      this.setStatusBasedOnResult(task, this.errStateResultObj());
      return err;
    });
  }
  startService(task) {
    task.isExecutionCompleted = false;
    this.taskManagerService.startService(task.port, task.serviceId).subscribe((result: any) => {
      task.isExecutionCompleted = true;
      this.setStatusBasedOnResult(task, result);
    }, (err) => {
      task.isExecutionCompleted = true;
      this.setStatusBasedOnResult(task, this.errStateResultObj());
      return err;
    });
  }
  restartService(task) {
    task.isExecutionCompleted = false;
    this.taskManagerService.restartService(task.port, task.serviceId).subscribe((result: any) => {
      task.isExecutionCompleted = true;
      this.setStatusBasedOnResult(task, result);
    }, (err) => {
      task.isExecutionCompleted = true;
      this.setStatusBasedOnResult(task, this.errStateResultObj());
      return err;
    });
  }
  saveAutoStartDetails() {
    this.noChangesToSaveErr = false;
    this.confirmSaveAutoStartRef.confirm().subscribe((isaccepted) => {
      if (isaccepted === true) {
        this.loader.display(true);
        const dataToSave = this.taskManagerList.map(x => {
          return { isAutoStart: x.isAutoStart === undefined ? false : x.isAutoStart, serviceId: x.serviceId };
        });
        this.taskManagerService.updateAutostartDetails(dataToSave).subscribe((res) => {
          this.loader.display(false);
          this.toastMessageService.addSingleToast('Data Saved Successfully');
        }, (err) => {
          this.loader.display(false);
          return err;
        });
      } else {
        /// changes are not saved
      }
    });
    // }
  }
  cancelAutoStartDetails() {

  }
  onSelectDeselect(task) {
    task.isAutoStart = !task.isAutoStart;
  }
}
