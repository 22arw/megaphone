import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import User from './interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getUserData = (): Promise<User> => {
    const promise = new Promise<User>((resolve, reject) => {
      this.http
        .get('/api/user')
        .toPromise()
        .then(
          res => {
            resolve(res as User);
          },
          err => {
            reject(err);
          }
        );
    });
    return promise;
  };
}
