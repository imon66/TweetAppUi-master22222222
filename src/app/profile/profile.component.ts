import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Tweet } from '../_models/tweet';
import { MembersService } from '../_services/members.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  member:User;
  tweets:Tweet[];
  constructor(private memberService:MembersService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }
  loadMember(){
    this.memberService.getMember(this.route.snapshot.paramMap.get('loginid')).subscribe(member=>{
      
      this.member=member;
    })
  }
}
