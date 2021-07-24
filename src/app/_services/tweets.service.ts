import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Tweet } from '../_models/tweet';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {
  baseUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }
  getTweets(memberId:string){
    return this.http.get<Tweet[]>(this.baseUrl+'tweets/getTweets/'+memberId);
  }
  addTweet(tweet:any,id:number){
    return this.http.post(this.baseUrl+'tweets/'+id+'/add',tweet).pipe(
      map(data1=>data1=JSON.parse(JSON.stringify(data1)))
    );
  }
  public addComment(userComment:any,username:string){
    
    return this.http.post(this.baseUrl+'tweets/'+username+'/reply/'+userComment.tweetId,userComment).pipe(
      map(data1=>data1=JSON.parse(JSON.stringify(data1)))
    )
  }
  public getTweetById(tweetId:string,loginId:string){
    var result= this.http.get(this.baseUrl+"tweets/tweetById/"+tweetId+"/userId/"+loginId);
    console.log(result);
    return result;
  }
  public getTweetCommentsById(tweetId : string)
  {
    return this.http.get(this.baseUrl + "tweets/tweetCommentsById/" + tweetId);
  }
  public updateTweet(tweet:any,username:string){
    return this.http.put(this.baseUrl+'tweets/'+username+'/update/'+tweet.id,tweet).pipe(
      map(data1=>data1=JSON.parse(JSON.stringify(data1)))
    )
  }
  public deleteTweet(id:any,username:string){
    return this.http.delete(this.baseUrl+'tweets/'+username+'/delete/'+id);
  }
  public addLike(userLike:any,username:string,id:string){
    return this.http.post(this.baseUrl+'likes/'+username+'/like/'+id,userLike).pipe(
      map(data1=>data1=JSON.parse(JSON.stringify(data1)))
    )
  }
  public getTweetLikesById(tweetId:string){
    return this.http.get(this.baseUrl+'likes/GetTweetLikesByTweetId/'+tweetId);
  }
}
