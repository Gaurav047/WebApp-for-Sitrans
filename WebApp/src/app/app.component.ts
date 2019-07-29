import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { AuthService } from '@app/services/shared/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from '@app/services/shared/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'WebApp';
  currentUrl: string;
  showLoader: boolean;
  // close the session on close of browser
  // @HostListener('window:beforeunload', ['$event'])
  // public beforeunloadHandler($event) {
  //   $event.returnValue = "Are you sure?";
  //   console.log('close', $event.returnValue )
  //   this.auth.logout();
  // }
  constructor(public auth: AuthService,
    private router: Router, private loaderService: LoaderService) {

  }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    }, (err) => {
     // console.log('err', err);
     return err; // sonarqube fix
    });
  }
  ngAfterViewInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      // setTimeout(() => {
      this.showLoader = val;
      // });
    }, (err) => {
     // console.log('err', err);
     return err; // sonarqube fix
    });
  }
}
