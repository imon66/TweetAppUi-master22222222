import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tweet } from 'src/app/_models/tweet';
import { TweetsService } from 'src/app/_services/tweets.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: User;
  model: any = {};
  tweets: Tweet[];
  newTweetForm: FormGroup;
  loginId: string;
  editProfileForm: FormGroup;
  submitted:boolean;
  constructor(private memberService: MembersService, private route: ActivatedRoute, private tweetService: TweetsService, private fb: FormBuilder,private router:Router,private toastr:ToastrService) { 
    router.routeReuseStrategy.shouldReuseRoute=function(){
      return false;
    }
  }

  ngOnInit(): void {
    this.loadMember();
    this.initializeNewTweetForm();
    this.loginId = JSON.parse(localStorage.getItem('user')).loginId;
    this.initializeEditProfileForm();
  }
  loadMember() {
    console.log(this.route.snapshot.paramMap.get('loginid'));
    this.memberService.getMember(this.route.snapshot.paramMap.get('loginid')).subscribe(member => {

      this.member = member;
      console.log(this.member);
    })
  }
  post() {
    this.submitted=true;
    if(this.newTweetForm.invalid){
      return;
    }
    const userId=localStorage.getItem("user")==null?"":JSON.parse(localStorage.getItem("user")).userId;
    
    const tweet={
      message:this.newTweetForm.value.message,
      tag:this.newTweetForm.value.tag,
      appUserId:userId
    }
    this.tweetService.addTweet(tweet, tweet.appUserId).subscribe(result => {
      if(tweet){
        //this.tweets.push(result);
        this.toastr.success("Tweet posted successfully.");
        this.newTweetForm.reset();
        this.loadMember();
      }
    })
  }
  initializeNewTweetForm() {
    this.newTweetForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(144)]],
      tag: ['', Validators.maxLength(50)]
    })
  }

  saveChanges() { }
  cancel() { }
  initializeEditProfileForm() {
    // this.editProfileForm=this.fb.group({
    //   firstname:[this.member.firstname,Validators.required],
    //   lastname:[this.member.lastname,Validators.required],
    //   email:[this.member.email,[Validators.required,Validators.email]],
    //   loginid:[this.member.loginid],
    //   password:[this.member.password],

    //   contactNumber:[this.member.contactnumber,[Validators.required,Validators.pattern("^[0-9]*$")]]
    // })
  }
}
