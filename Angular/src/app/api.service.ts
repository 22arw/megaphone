import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import User from './interfaces/user';
import Admin from './interfaces/admin';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAdminData = (): Promise<Admin> => {
    const promise = new Promise<Admin>((resolve, reject) => {
      this.http
        .get('/api/admin')
        .toPromise()
        .then(
          res => {
            resolve(res as Admin);
          },
          err => {
            reject(err);
          }
        );
    });
    return promise;
  };

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
