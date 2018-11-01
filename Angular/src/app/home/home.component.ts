import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import User from '../interfaces/user';
import Admin from '../interfaces/admin';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  admin: Admin;

  constructor(private ApiService: ApiService) {}

  ngOnInit() {
    this.ApiService.getUserData().then(res => {
      this.user = res;
      if (res.isAdmin) {
        this.ApiService.getAdminData().then(res => {
          this.admin = res;
        });
      }
    });
  }

  toPrettyPhone(phoneNumber: String): String {
    let phone = phoneNumber.substring(1).split('');
    return `${phone[0]} \(${phone[1]}${phone[2]}${phone[3]}\) ${phone[4]}${
      phone[5]
    }${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`;
  }
}
