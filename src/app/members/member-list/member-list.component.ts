import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from 'src/app/_services/account.service';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members:any;
  currentUser:any;
  constructor(private memberService:MembersService,private route:ActivatedRoute,private router:Router) { 
    router.routeReuseStrategy.shouldReuseRoute=function(){
      return false;
    }
  }

  ngOnInit(): void {
    this.currentUser=JSON.parse(localStorage.user);
    
    this.loadMembers(this.currentUser.loginId);
  }
  loadMembers(loginId:string){
    this.memberService.getOtherMembers(loginId).subscribe(members=>{
      this.members=members;
      console.log(this.members);
    })
  }

}
