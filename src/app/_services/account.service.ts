import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl=environment.apiUrl;
  private currentUserSource=new ReplaySubject<User>(1);
  currentUser$=this.currentUserSource.asObservable();
  
 currentUserLoginId=localStorage.getItem("user")==null?"":JSON.parse(localStorage.getItem("user")).loginId;
  
  constructor(private http:HttpClient) { }
  login(model:any){
    return this.http.post(this.baseUrl+'account/login',model).pipe(
      map((response:User)=>{
        const user=response;
        console.log(user);
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }
  setCurrentUser(user:User){
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
  register(model:any){
    
    return this.http.post(this.baseUrl+'account/register',model).pipe(
      map(user=>user=JSON.parse(JSON.stringify(user)))
    )
  }
  resetPassword(model:any){
    console.log(this.currentUserLoginId);
    var response= this.http.post(this.baseUrl+'Users/'+this.currentUserLoginId+'/forgot',model).pipe(
      map(user=>user=JSON.parse(JSON.stringify(user)))
    );
    console.log(response);
    return response;
  }
  
}
