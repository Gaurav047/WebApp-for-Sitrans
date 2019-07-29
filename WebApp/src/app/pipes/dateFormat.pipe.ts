import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'datepipe'
})
export class DateFormatPipe implements PipeTransform {

  transform(dataList: Array<any>, startDate: string, endDate: string): any {
    const filteredArray = new Array();
    const datePipe = new DatePipe('en-US');
    startDate = datePipe.transform(startDate, 'yyyy-MM-dd');
    endDate = datePipe.transform(endDate, 'yyyy-MM-dd');
    if (dataList && dataList.length) {
      dataList.forEach(data => {
        const dataViewerDate = datePipe.transform(data.timeStamp, 'yyyy-MM-dd');
        if (dataViewerDate >= startDate && dataViewerDate <= endDate) {
          filteredArray.push(data);
        }
      });
    }
    return filteredArray;
  }

  dateFormatToISO(date) {
    const datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'yyyy-MM-dd  HH:mm:ss');
    return date;
  }

}
