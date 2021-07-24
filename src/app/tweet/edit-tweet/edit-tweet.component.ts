import { Component, OnInit } from '@angular/core';
import { Tweet } from 'src/app/_models/tweet';
import { AccountService } from 'src/app/_services/account.service';
import { TweetsService } from 'src/app/_services/tweets.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MembersService } from 'src/app/_services/members.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-tweet',
  templateUrl: './edit-tweet.component.html',
  styleUrls: ['./edit-tweet.component.css']
})
export class EditTweetComponent implements OnInit {
  tweet: Tweet;
  editTweetForm: FormGroup;
  submitted: boolean;
  Tweet: any;
  user: any;
  tweetId:any;
  constructor(private accountService: AccountService, private tweetservice: TweetsService, private fb: FormBuilder, private memberService: MembersService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute) {
    // this.accountService.currentUser$.pipe(take(1)).subscribe(t)
  }

  ngOnInit(): void {
    
    this.route.params.subscribe((params:Params)=>{
      this.tweetId=params['tweetId'];
      console.log(this.tweetId);
      this.getTweetById(this.tweetId);
    });
    this.initializeUpdateTweetForm();
    
  }
  initializeUpdateTweetForm() {
    
    this.editTweetForm = this.fb.group({
      message: ["", [Validators.required, Validators.maxLength(144)]],
      tag: ["", Validators.maxLength(50)]
    });
  }
  update() {
    this.submitted = true;
    if (this.editTweetForm.invalid) {
      return;
    }
    const username = localStorage.getItem("user") == null ? "" : JSON.parse(localStorage.getItem("user")).loginId;
    const tweet = {
      id: this.Tweet.tweetId,
      commentsCount: this.Tweet.commentsCount,
      message: this.editTweetForm.value.message,
      tag: this.editTweetForm.value.tag,
      createdOn: this.Tweet.createdOn,
      appUserId: this.user.userId,
      replies: this.Tweet.replies
    }
    this.tweetservice.updateTweet(tweet, this.user.loginId).subscribe(data => {
      if (data == "Tweet updated") {
        this.router.navigate(['members/'+JSON.parse(localStorage.getItem("user")).loginId]);
        this.toastr.success("Tweet updated successfully");
      }
      else {
        this.toastr.error("Could not update tweet");
      }
    })
  }
  private getTweetById(tweetId: string) {
    const username = JSON.parse(localStorage.getItem("user")).loginId;
    console.log(username);
    this.tweetservice.getTweetById(tweetId, username).subscribe(data => {
      this.Tweet = data;
      console.log(this.Tweet);
      this.memberService.getUserById(this.Tweet.appUserId).subscribe(data => {
        this.user = data;
      })
    })
  }
}
