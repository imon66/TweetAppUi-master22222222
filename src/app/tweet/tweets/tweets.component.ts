import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { User } from '../../_models/user';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Tweet } from '../../_models/tweet';
import { TweetsService } from '../../_services/tweets.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit,OnChanges {
  @Input() member: User;
  tweets: Tweet[];
  loginId:string;
  submitted:boolean;
  addCommentForm:FormGroup;
  tweetResult:any;
  user:any;
  comments:any[]=[];
  displayNoCommentsData:string;
  replyMode=false;
  liked:boolean;
  likes:any[]=[];
  replyTweet:string;
  likeTweet:string;
  hasComments:any;
  likedByUser:boolean;
  userId = JSON.parse(localStorage.getItem("user")).userId;
  
  constructor(private memberService: MembersService, private route: ActivatedRoute, private tweetService: TweetsService, private toastr: ToastrService,private fb:FormBuilder,private location:Location) { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.loadTweet();
  }

  ngOnInit(): void {
    this.loadMember();
    this.loadTweet();
    this.loginId=JSON.parse(localStorage.user).loginId;
    //console.log(this.tweets);
    this.initializeAddCommentForm();
    this.displayNoCommentsData="true";
    
  }
  loadMember() {
    this.memberService.getMember(this.route.snapshot.paramMap.get('loginid')).subscribe(member => {

      this.member= member;
      //console.log(this.member);
    })
  }
  isEmptyObject(obj) {
    //console.log(obj[0]=== undefined)
    return (typeof obj[0]=== undefined);
  }
  loadTweet() {
    this.tweetService.getTweets(this.member.userId).subscribe(tweets => {
      this.tweets = tweets;
      //console.log(this.tweets);
      this.tweets.forEach(tweet=>{
        this.getTweetCommentsById(tweet.tweetId);
        this.getTweetLikesById(tweet.tweetId);
      })
      
    })
  }
  
  initializeAddCommentForm(){
    this.addCommentForm=this.fb.group({
      comments:['',Validators.required],
      tags:['']
    })
  }
  addComments(tweetId:string){
    const currentUser=localStorage.getItem("user")==null?"":JSON.parse(localStorage.getItem("user"));
    this.submitted=true;
    if(this.addCommentForm.invalid){
      return;
    }
    const userComment={
      tweetId:tweetId,
      comment:this.addCommentForm.value.comments,
      tag:this.addCommentForm.value.tags,
      username:currentUser.loginId,
      userId:currentUser.userId
    }
    
    this.tweetService.addComment(userComment,userComment.username).subscribe(()=>{
      this.getTweetCommentsById(tweetId);
    });
    this.replyTweet=null;
    this.addCommentForm.reset();
  }
  
  replytoTweet(tweetId:string){
    this.replyTweet=tweetId;
  }
  getTweetById(tweetId : string)
  {
    
    this.tweetService.getTweetById(tweetId, this.userId ).subscribe(data=>
    {
        this.tweetResult = data;  
        //console.log(this.tweetResult);
        this.memberService.getUserById(this.tweetResult.appUserId).subscribe(data=>
        {
            this.user = data;
            console.log(this.user);
        });  
        this.getTweetLikesById(tweetId);
        this.getTweetCommentsById(tweetId);
                                                                                                                                                                                                                                                                   
    });
  }
  getTweetCommentsById(tweetId:string){
    //console.log(tweetId);
    this.tweetService.getTweetCommentsById(tweetId).subscribe(data=>
      {
        //console.log("comments :")
        //console.log(data);
          this.comments[tweetId] = data; 
          //console.log(this.comments);
          // if(this.comments.length > 0 && this.comments.tweetId==tweetId)
          // {
          //   this.displayNoCommentsData = "true";
          // }
          // else{
          //   this.displayNoCommentsData = "false"
          // }
      });
  }
  deleteTweet(id:any,username:string){
    this.tweetService.deleteTweet(id,username).subscribe(()=>{
      this.ngOnInit();
      this.toastr.success("Tweet deleted successfully");
    });
  }
  toggle(action:string,tweetId:string,likeId?:string){
    const user=localStorage.getItem("user")==null?"":JSON.parse(localStorage.getItem("user"));
    const userLike={
      tweetId:tweetId,
      userId:user.userId,
      liked:action,
      likeId:likeId,
      //likesCount:this.liked==false?this.tweets.forEach(tweet=>tweet.likesCount+1):this.tweets.forEach(tweet=>tweet.likesCount-1),
      username:user.loginId
    }
    this.tweetService.addLike(userLike,userLike.username,userLike.tweetId).subscribe(()=>{
      this.getTweetById(tweetId);
      if(action=='like')
      this.toastr.success("Tweet liked successfully");
      else
      this.toastr.success("Tweet unliked successfully");
    });
    this.likeTweet=null;
  }
  reactToTweet(tweetId:string){
    this.likeTweet=tweetId;
  }
  getTweetLikesById(tweetId:string){
    this.tweetService.getTweetLikesById(tweetId).subscribe(data =>
      {
          this.likes[tweetId] = data;   
          console.log(this.likes[tweetId]);
          if(this.likes[tweetId].find(x=>x.userId==this.userId)){
            this.likedByUser=true;
          }
          else{
            this.likedByUser=false;
          }
          console.log(this.likedByUser);
      });
  }
}
