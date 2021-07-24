import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any={};
  currentUser:any;
  
  constructor(public accountService:AccountService,private router:Router,private toastr:ToastrService) {
   
   }

  ngOnInit(): void {
    this.currentUser=localStorage.getItem("user")==null?"":JSON.parse(localStorage.getItem("user"));
  }
  login(loginForm:NgForm){
    console.log(this.model);
    this.accountService.login(this.model).subscribe(response=>{
      this.router.navigateByUrl('/members/'+this.model.username);
      loginForm.resetForm();
    },error=>{
      console.log(error);
      this.toastr.error(error.error);
    })
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
  

}
