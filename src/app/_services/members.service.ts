import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/user';
import { Observable } from 'rxjs';
import { Tweet } from '../_models/tweet';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }
  getMembers(){
    return this.http.get<User[]>(this.baseUrl+'users/all');
  }
  getMember(loginid:string){
    return this.http.get<User>(this.baseUrl+'users/search/'+loginid)
  }
  addLike(tweetId:string){
    return this.http.post(this.baseUrl+'likes/'+tweetId,{})
  }
  getLikes(predicate:string){
    return this.http.get<Partial<User[]>>(this.baseUrl+'likes?predicate='+predicate);
  }
  getOtherMembers(loginId:string){
    return this.http.get<User[]>(this.baseUrl+'users/getOtherUsers/'+loginId);
  }
  getUserById(userId:string){
    return this.http.get<User>(this.baseUrl+'users/getUserById/'+userId)
  }
}
