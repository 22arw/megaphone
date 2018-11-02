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
  COST_PER_MESSAGE = 0.005;
  MAX_CHAR_COUNT = 255;
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

  canSendMessage(orgId: number): boolean {
    const numberOfSubscribers = Number(
      document.getElementById(`subscribers-${orgId}`).innerText
    );

    const messageLength = (document.getElementById(
      `text-${orgId}`
    ) as HTMLInputElement).value.length;

    return numberOfSubscribers !== 0 && messageLength !== 0;
  }

  charCount(e: KeyboardEvent): void {
    const message = (<HTMLInputElement>e.target).value;
    const numberOfChars = message.length;
    // const numberOfSignatureBlockChars =
    //   e.srcElement.attributes.getNamedItem('subscriptioncode').value.length + 3;
    // const numberOfMessages =
    //   numberOfChars > 160
    //     ? Math.ceil(numberOfChars / 153)
    //     : Math.ceil(numberOfChars / 160);
    // const maxChars =
    //   numberOfChars <= 160
    //     ? 160
    //     : numberOfMessages * 153 >
    //       this.MAX_CHAR_COUNT - numberOfSignatureBlockChars
    //       ? this.MAX_CHAR_COUNT - numberOfSignatureBlockChars
    //       : numberOfMessages * 153;
    const id = e.srcElement.id.split('-')[1];

    // const innerText = `${numberOfChars}/${maxChars} : ${numberOfMessages}`;
    const innerText = `${numberOfChars}/${this.MAX_CHAR_COUNT}`;
    const elementId = `character-count-${id}`;
    document.getElementById(elementId).innerText = innerText;
    if (numberOfChars === this.MAX_CHAR_COUNT) {
      document.getElementById(elementId).style.fontWeight = 'bold';
    } else {
      document.getElementById(elementId).style.fontWeight = 'normal';
    }
  }

  getCost(numberOfSubscribers: number): number {
    return numberOfSubscribers * this.COST_PER_MESSAGE;
  }

  getMaxLength(subscriptionCode: string): number {
    // 3 is for the carriage return, a dash (-) and a space.
    // return this.MAX_CHAR_COUNT - subscriptionCode.length - 3;
    return this.MAX_CHAR_COUNT;
  }

  sendMessage(orgId: number): void {
    const messageResponseDiv = document.getElementById(
      `message-response-${orgId}`
    );
    const message = (document.getElementById(
      `text-${orgId}`
    ) as HTMLInputElement).value;

    messageResponseDiv.innerHTML = `<div class="alert alert-primary alert-dismissible fade show" role="alert">
    You're message is being sent. Standby please. 😁
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;

    this.ApiService.sendMessage(orgId, message)
      .then(res => {
        if (res.success) {
          messageResponseDiv.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
    You're message has been accepted. Give us a few minutes to reach everyone. 😎👍
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
        } else {
          messageResponseDiv.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    ${res.error} 😓
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
        }
      })
      .catch(err => console.error(err));
  }

  toPrettyPhone(phoneNumber: String): String {
    let phone = phoneNumber.substring(1).split('');
    return `${phone[0]} \(${phone[1]}${phone[2]}${phone[3]}\) ${phone[4]}${
      phone[5]
    }${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`;
  }
}
