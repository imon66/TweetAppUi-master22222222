import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  resetPasswordForm: FormGroup;
  validationErrors: string[] = [];
  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      confirmCurrentPassword: ['', [Validators.required, this.matchValues('currentPassword')]],
      newPassword: ['', Validators.required]
    })
    this.resetPasswordForm.controls.currentPassword.valueChanges.subscribe(() => {
      this.resetPasswordForm.controls.confirmCurrentPassword.updateValueAndValidity();
    })
    console.log(this.resetPasswordForm);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    }
  }
  resetPassword() {
    const user = {
      oldPassword: this.resetPasswordForm.value.currentPassword,
      newPassword: this.resetPasswordForm.value.newPassword
    }
    this.accountService.resetPassword(user).subscribe(response => {
      console.log(response);
      this.accountService.logout();
      this.router.navigateByUrl('/');
      this.toastr.success("Successfully reset Password");
    }, error => {
      console.log(error);
      this.validationErrors = error;
      this.toastr.error(error.error);
    })

  }
  cancel() {
    this.cancelRegister.emit(false);
  }
}
