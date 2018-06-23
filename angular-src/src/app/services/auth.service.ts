import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Data } from '../models/data';
import { DataAuth } from '../models/DataAuth';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const jwtHelper = new JwtHelperService();

@Injectable()

export class AuthService {
  authToken: any;
  user: User;
  registerUrl: string = 'users/register';
  authUrl: string = 'users/authenticate';
  profileUrl: string = 'users/profile';

  constructor(private http: HttpClient) { }

  registeruser(user): Observable<Data>{
    return this.http.post<Data>(this.registerUrl, user, httpOptions)
  }

  authenticateUser(user): Observable<DataAuth> {
    return this.http.post<DataAuth>(this.authUrl, user, httpOptions);
  }

  getProfile(): Observable<any>{
    return this.http.get<any>(this.profileUrl, this.setAuthHttpHeaders());
  }

  loggedIn(){
    this.loadToken();
    return !jwtHelper.isTokenExpired(this.authToken);
  }

  setAuthHttpHeaders(){
    this.loadToken();
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.authToken})
    };
  }

  loadToken(){
    const token = localStorage.getItem('jwtToken');
    if(token){
      this.authToken = token;
    } else {
      this.authToken = '';
    }
  }

  storeUserData(token, user){
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logoutUser(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
