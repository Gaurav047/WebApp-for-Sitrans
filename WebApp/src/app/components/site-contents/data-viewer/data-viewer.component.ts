import { Component, OnInit, ViewChild } from '@angular/core';
import { DataViewerService } from './data-viewer.service';
import { DateFormatPipe } from '@app/pipes/dateFormat.pipe';
import { LoaderService } from '@app/services/shared/loader.service';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent implements OnInit {
  cols: any;
  dataLogger: any;
  filterText: any = [];
  startDate: any;
  endDate: any;
  startTimeStamp: any;
  endTimeStamp: any;
  validateDateRange: boolean;
  errorMessage: String;
  compareDates: boolean;
  futureFromDate: boolean;
  constructor(private dataViewerService: DataViewerService, private dateFormatPipe: DateFormatPipe, private loaderService: LoaderService) { }
  ngOnInit() {
    this.validateDateRange = false;
    this.compareDates = false;
    this.futureFromDate = false;
    this.cols = [
      { field: 'shield', header: 'Shield', filter: true },
      { field: 'channel', header: 'Channel', filter: true },
      { field: 'deviceName', header: 'Device Name', filter: false },
      { field: 'parameterName', header: 'Parameter Name', filter: true },
      { field: 'parameterValue', header: 'Parameter Value', filter: false },
      { field: 'timeStamp', header: 'Timestamp', filter: false }
    ];
    this.getDataViewerData();
  }

  getDataViewerData() {
    this.loaderService.display(true);
    this.dataViewerService.getDataViewerLogs(this.startTimeStamp, this.endTimeStamp).subscribe(data => {
      if (data !== undefined && data !== null) {
        data.forEach(element => {
          element.timeStamp = this.dateFormatPipe.dateFormatToISO(element.timeStamp);
        });
        this.dataLogger = data;
      }
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }

  onSearchFilter() {
    if (this.startDate !== null && this.startDate !== undefined && this.endDate !== null && this.endDate !== undefined) {

      this.validateDateRange = false;
      this.compareDates = false;
      this.futureFromDate = false;

      const dateFrom = new Date(this.startDate);
      dateFrom.setHours(0);
      dateFrom.setMinutes(0);
      dateFrom.setSeconds(0);
      dateFrom.setMilliseconds(0);
      this.startTimeStamp = dateFrom.getTime();

      const dateTo = new Date(this.endDate);
      dateTo.setHours(23);
      dateTo.setMinutes(59);
      dateTo.setSeconds(59);
      dateTo.setMilliseconds(999);
      this.endTimeStamp = dateTo.getTime();

      const todaysDate = Date.now();
      const dateNow = new Date(todaysDate);
      dateNow.setHours(23);
      dateNow.setMinutes(59);
      dateNow.setSeconds(59);
      dateNow.setMilliseconds(999);
      const currentDate = dateNow.getTime();
      if (this.startTimeStamp <= currentDate && this.endTimeStamp <= currentDate) {
        if (this.startTimeStamp <= this.endTimeStamp) {
          this.getDataViewerData();
        } else {
          this.compareDates = true;
          this.errorMessage = 'From Date cannot be greater than To Date';
        }
      } else {
        this.futureFromDate = true;
        this.errorMessage = `Date cannot be greater than Today's date`;
      }
    } else {
      this.validateDateRange = true;
      this.errorMessage = 'Please Select the Date Range';
    }
  }
  validationMsg() {
    return this.compareDates || this.futureFromDate || this.validateDateRange;
  }
  clearText(i) {
    // this.filterText[i] = [];
  }
}
