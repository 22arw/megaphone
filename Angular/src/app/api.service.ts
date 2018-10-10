import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { HttpHeaders } from '@angular/common/http';

import UserInterface from './interfaces/userInterface';
import AuthInterface from './interfaces/authInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() {}

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  // registerUser(email: string, password: string): Observable<AuthInterface> {
  //   const registerBody = { email: email, password: password };
  //   return this.http.post<AuthInterface>(
  //     '/api/auth',
  //     registerBody,
  //     this.httpOptions
  //   );
  // }
}
