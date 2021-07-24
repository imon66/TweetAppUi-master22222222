import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { TweetsComponent } from './tweet/tweets/tweets.component';
import { AuthGuard } from './_guards/auth.guard';
import { EditTweetComponent } from './tweet/edit-tweet/edit-tweet.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'members', component: MemberListComponent },
  
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members/:loginid', component: MemberDetailComponent },
      {path:'resetPassword',component:ResetPasswordComponent},
      
      { path: 'tweets', component: TweetsComponent },
      { path: 'tweet/edit/:tweetId', component: EditTweetComponent },

    ]
  },

  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
