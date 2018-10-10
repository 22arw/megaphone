import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(private ApiService: ApiService) {}

  ngOnInit() {}

  registerUser() {
    // TODO: perform validation
    const email = (document.getElementById(
      'register-email'
    ) as HTMLInputElement).value;
    const password = (document.getElementById(
      'register-password'
    ) as HTMLInputElement).value;

    console.log(`register user! ${email} ${password}`);

    // this.ApiService.registerUser(email, password);
  }
}
