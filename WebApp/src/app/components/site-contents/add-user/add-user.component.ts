import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '@app/services/shared/auth.service';
import { Subject } from 'rxjs';
import { ModalService } from '@app/services/shared/modal.service';
import { UserService, existingUserIdValidator } from '@app/services/user.service';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { LoaderService } from '@app/services/shared/loader.service';
import { ToastMessageService } from '@app/services/shared/toast-message.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit {
  addUser: FormGroup;
  isformSubmitted: boolean;
  usersList: any;
  rolesList: any;
  scope: string;
  private visible = new Subject<any>();
  @ViewChild('confirmAddUser') adduserConfirmRef: ConfirmationDialogComponent;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private userService: UserService,
    private loaderService: LoaderService, private toastMessageService: ToastMessageService
  ) {
    this.usersList = this.userService.users;
  }

  ngOnInit() {
    // initializing the add user form
    this.addUser = this.formBuilder.group({
      userId: ['', [Validators.required, Validators.minLength(5)], // sync validators
        [existingUserIdValidator(this.userService)] // async validators
      ],
      username: ['', Validators.required],
      email: ['', Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')],
      role: ['', Validators.required],
      phonenumber: ['', [Validators.maxLength(15), Validators.pattern('^[0-9-+()]*$')]]
    });
    // the user scope which is displayed based on the user role.
    this.scope = 'Indicates accessibility of user';
    // list of roles to be displayed
    this.rolesList = [{ label: 'Admin', value: 'Admin' },
    { label: 'Operator', value: 'Operator' },
    { label: 'Reporter', value: 'Reporter' }];
  }
  // gets the value of userid
  get userId() {
    return this.addUser.get('userId');
  }
  // validates each field from the form
  isFieldValid(field: string) {
    return (this.addUser.get(field).invalid && this.isformSubmitted === true);
  }
  // on click of the add user (save)button
  onSubmit = () => {
    this.isformSubmitted = true;
    // stop here if form is invalid
    if (this.addUser.invalid) {
      return;
    }
    // user clicks on ok of the confirmation add the user to the database
    this.adduserConfirmRef.confirm().subscribe((isaccepted) => {
      if (isaccepted === true) {
        this.loaderService.display(true);
        const userDataToSave = this.addUser.value;
        userDataToSave['scope'] = this.scope;
        this.authService.registerUser(userDataToSave)
          .subscribe((res) => {
            this.modalService.closeModal();
            // get the users details again after insert of new user
            this.userService.getUsersdetail().subscribe(() => {
              this.loaderService.display(false);
            }, (err) => {
              return err;
            });
            const addMsg = 'Added successfully';
            this.toastMessageService.addSingleToast(addMsg);
          }, (err) => {
            return err;
          });
      } else {
      }
    });

  }
  // function which provides values to scope based on Role
  scopeOnRoleChange(event: any) {
    switch (event.value.toLowerCase()) {
      case 'admin': this.scope = 'Admin';
        break;
      case 'operator': this.scope = 'Write';
        break;
      case 'reporter': this.scope = 'Read';
        break;
      default: this.scope = 'Indicates accessibility of user';
        break;
    }
  }
  // close the add user pop up on click of cancel button
  closeAddUserPopup() {
    this.modalService.closeModal();
  }
}
