import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { Data } from '../models/data';
import { User } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable()

export class AuthService {
  authToken: any;
  user: User;
  registerUrl: string = 'http://localhost:3000/users/register';

  constructor(private http: HttpClient) { }

  registeruser(user): Observable<Data>{
    return this.http.post<Data>(this.registerUrl, user, httpOptions)
  }
}
