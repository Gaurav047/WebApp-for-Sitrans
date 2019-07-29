import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StatusBarService } from '@app/components/site-contents/status-bar/status-bar.service';
import { SitransListviewService } from '@app/components/site-contents/sitrans-listview/sitrans-listview.service';

@Component({
  selector: 'app-status-tile',
  templateUrl: './status-tile.component.html',
  styleUrls: ['./status-tile.component.scss']
})
export class StatusTileComponent implements OnInit {
  @Input()
  public data: any;
  @Output() tileClickedEvent: EventEmitter<boolean> = new EventEmitter();
  diagnosticStateCount: any;

  constructor(public sitransListService: SitransListviewService, private statusBarService: StatusBarService) {
  }

  ngOnInit() {
  }
  filterDiagnosticStateData(diagnosticStateCode: string, event: any) {
    this.tileClickedEvent.emit(true);
    this.statusBarService.detectDiagnosticStateTileClick(diagnosticStateCode);
    event.currentTarget.classList.add('onTileSelection');
  }
}
