import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalPopupComponent } from '@app/components/shared/modal-popup/modal-popup.component';
import { UserService } from '@app/services/user.service';
import { AuthService } from '@app/services/shared/auth.service';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { GridProperties } from '@app/model/gridProperties';
import { AddUserComponent } from '@app/components/site-contents/add-user/add-user.component';
import { LoaderService } from '@app/services/shared/loader.service';
import { getModifiedData } from '@app/utility/modifiedArrayData';
import { ToastMessageService } from '@app/services/shared/toast-message.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent implements OnInit {
  cols: any[];
  users: any;
  email: string;
  loginData: any;
  rolesList: any;
  zeroUsersSelectedErr: boolean;
  gridProperties: GridProperties;
  shieldChannelData: any;
  editUserData: boolean;
  noDataToSaveErr: boolean;
  mockdata:any;
  @ViewChild('userModal') public addUserModalRef: ModalPopupComponent;
  @ViewChild('confirmDelete') public confirmDeleteRef: ConfirmationDialogComponent;

  constructor(public userService: UserService,
    private auth: AuthService,
    private loaderService: LoaderService,
    private toastMessageService: ToastMessageService,private http: HttpClient ) {
  }
  ngOnInit() {
    this.mockdata = [{id:1,filename:'xx.json',lastModified:'123'},
    {id:2,filename:'yyy.json',lastModified:'123'}];
    this.cols = [
      { header: 'Name' },
      { header: 'Email Id' },
      { header: 'Phone Number' },
      { header: 'Access Role' },
      { header: 'Scope' }
    ];
    // method to load the users grid
    this.loadUserDetailsGrid();
    // the data of the loggin in user
    this.loginData = { username: this.auth.loggedInUsername.toLowerCase(), accessRole: this.auth.loggedInUserRole.toLowerCase(), userId: this.auth.loggedInUserId.toLowerCase() };

    // the list of roles to be displayed
    this.rolesList = [{ label: 'Admin', value: 'Admin' },
    { label: 'Operator', value: 'Operator' },
    { label: 'Reporter', value: 'Reporter' }];
    this.editUserData = false;

      return this.http.get<any>(`http://yourIp:portnumber/user/usersdetail`)
        .pipe(map((res: any) => {
       
          return res // returning result to find the dirty bit;
        })).subscribe(res=>{
this.mockdata = res;
        });
  }
  // to compose email on click of mail icon
  composeEmail(emailId: string) {
    const subject = 'PI Digitalization';
    this.email = 'mailto:' + emailId + '?subject=' + subject;
  }
  // open the add user pop up
  openAddUserPopup(user) {
    // remove no save changes error
    this.noDataToSaveErr = false;
    // to remove the 'no user selected' message on delete action from the view
    this.zeroUsersSelectedErr = false;
    this.addUserModalRef.show(AddUserComponent);
  }

  deleteUsers() {
    // remove no save changes error
    this.noDataToSaveErr = false;
    const selectedData = this.userService.users.filter(x => x.checked === true).map((y) => {
      return { userId: y.userId };
    });
    if (selectedData.length > 0) {
      this.zeroUsersSelectedErr = false;
      this.confirmDeleteRef.confirm().subscribe((isaccepted) => {
        if (isaccepted === true) {
          this.userService.deleteUsers(selectedData).subscribe((res) => {
            this.loadUserDetailsGrid();
            this.userService.users.checked = false;
            const deleteMsg = 'Deleted Successfully';
            this.toastMessageService.addSingleToast(deleteMsg);
          });
        } else {
        }
      });
    } else {
      this.zeroUsersSelectedErr = true;
    }

  }
  updateUserDetails(usersData) {
    // method checks if there is a change of data from previous data
    this.zeroUsersSelectedErr = false;
    const modified = getModifiedData(usersData, ['role'], 'originalData');
    if (modified && modified.length > 0) {
      this.noDataToSaveErr = false;
      const editeddata = modified.filter(d => d.isRoleChanged === true)
        .map(y => {
          return { userId: y.userId, role: y.role, scope: y.scope };
        });
      this.userService.updateUsersDetail(editeddata).subscribe((res) => {
        this.loadUserDetailsGrid();
        const saveMsg = 'Saved Successfully';
        this.toastMessageService.addSingleToast(saveMsg);
      });
    } else {
      this.noDataToSaveErr = true;
      return;
    }
  }
  // loading the users details grid
  loadUserDetailsGrid() {
    this.loaderService.display(true);
    this.userService.getUsersdetail().subscribe((data) => {
      this.loaderService.display(false);
    }, (err) => {
      this.loaderService.display(false);
    });
  }
  scopeOnRoleChange(event: any, user) {
    if (event.value !== null) {
      user.isRoleChanged = true;
      if (event.value.toLowerCase() === 'admin') {
        user.scope = 'Admin';
      } else if (event.value.toLowerCase() === 'reporter') {
        user.scope = 'Read';
      } else if (event.value.toLowerCase() === 'operator') {
        user.scope = 'Write';
      } else {
        user.scope = 'NA';
      }
    } else {
      user.scope = 'NA';
    }

  }
  editSelfEmailId(user) {
    // this.userService.isuserEditEnabled({ userId: user.userId, editEnabled: true });
    user.isEditSelfEmailIdEnabled = true;
  }
  editSelfPhoneNumber(user) {
    user.isEditPhoneNoEnabled = true;
  }
  editUserDetails() {
    this.editUserData = true;
  }
  cancelEditChanges() {
    // method to reload the users grid
    this.loadUserDetailsGrid();
    this.editUserData = false;
    this.zeroUsersSelectedErr = false;
    this.noDataToSaveErr = false;
  }
  onAllSelectDeselect() {
    this.userService.users.checked = !this.userService.users.checked;
    if (this.userService.users.checked) {
      this.userService.users.map(x => {
        if (x.userId.toLowerCase() === this.loginData.userId) {
          x.checked = false;
        } else {
          x.checked = true;
        }
      });
    } else {
      this.userService.users.map(x => x.checked = false);
    }
  }
  onSelectDeselect(user) {
    user.checked = !user.checked;
  }
}
