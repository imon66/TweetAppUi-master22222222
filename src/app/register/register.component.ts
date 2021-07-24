import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  @Output() cancelRegister=new EventEmitter();
  
  
  registerForm:FormGroup;
  validationErrors:string[]=[];

  constructor(private accountService:AccountService,private toastr:ToastrService,private fb:FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(){
    this.registerForm=this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      loginid:['',Validators.required],
      password:['',Validators.required],
      confirmPassword:['',[Validators.required,this.matchValues('password')]],
      contactNumber:['',[Validators.required,Validators.pattern("^[0-9]*$")]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }
  matchValues(matchTo:string):ValidatorFn{
    return (control:AbstractControl)=>{
      return control?.value===control?.parent?.controls[matchTo].value?null:{isMatching:true}
    }
  }
  register(){
    console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe(response=>{
      console.log(response);
      this.router.navigateByUrl('/');
      this.toastr.success("Registration Successfull");
      this.registerForm.reset();
    },error=>{
      console.log(error);
      this.validationErrors=error;
      this.toastr.error(error.error);
    })
    
  }
  cancel(){
    this.cancelRegister.emit(false);
  }

}
