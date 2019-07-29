import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    // return null if controls haven't initialised yet
    if (!control || !matchingControl) {
      return null;
    }
    // if there is error in control then return
    if (control.errors) {
    //  matchingControl.setErrors(null);
      return null;
    }
     // return null if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== null && control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
@Component({
  selector: 'app-display-control-error',
  templateUrl: './display-control-error.component.html',
  styleUrls: ['./display-control-error.component.scss']
})

export class DisplayControlErrorComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() {
  }

  ngOnInit() {
  }

}
