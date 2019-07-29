import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailComponent } from './users-detail.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalPopupComponent } from '@app/components/shared/modal-popup/modal-popup.component';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogModule, ConfirmationService, DialogModule, MessageService } from 'primeng/primeng';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@app/services/shared/auth.service';

describe('UsersDetailComponent', () => {
  let component: UsersDetailComponent;
  let fixture: ComponentFixture<UsersDetailComponent>;
  let authService: AuthService;
  class AuthServiceStub {
    get loggedInUsername() {
      return localStorage.getItem('userName').toLowerCase();
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersDetailComponent, ModalPopupComponent, ConfirmationDialogComponent],
      imports: [TableModule, DropdownModule, ReactiveFormsModule, FormsModule, ConfirmDialogModule, DialogModule, RouterTestingModule, HttpClientModule],
      providers: [ConfirmationService, MessageService, {provide: AuthService, useClass: AuthServiceStub}]
    })
      .compileComponents();
       authService = TestBed.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
