import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import User from '../interfaces/user';
import Admin from '../interfaces/admin';
import { getSymbolIterator } from '@angular/core/src/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  COST_PER_MESSAGE = 0.005;
  MAX_CHAR_COUNT = 2048;
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

  addOrgManager(orgId: number): void {
    const newOrgManagerEmail = (document.getElementById(
      `new-org-manager-email-${orgId}`
    ) as HTMLInputElement).value
      .trim()
      .toLowerCase();
    console.log(newOrgManagerEmail);
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
    const numberOfSignatureBlockChars =
      e.srcElement.attributes.getNamedItem('subscriptioncode').value.length + 3;
    const numberOfMessages =
      numberOfChars > 160
        ? Math.ceil(numberOfChars / 153)
        : Math.ceil(numberOfChars / 160);
    const maxChars =
      numberOfChars <= 160
        ? 160
        : numberOfMessages * 153 >
          this.MAX_CHAR_COUNT - numberOfSignatureBlockChars
          ? this.MAX_CHAR_COUNT - numberOfSignatureBlockChars
          : numberOfMessages * 153;
    const id = e.srcElement.id.split('-')[1];

    const innerText = `${numberOfChars}/${maxChars} : ${numberOfMessages}`;
    const elementId = `character-count-${id}`;
    document.getElementById(elementId).innerText = innerText;
    if (numberOfChars === this.MAX_CHAR_COUNT - numberOfSignatureBlockChars) {
      document.getElementById(elementId).style.fontWeight = 'bold';
    } else {
      document.getElementById(elementId).style.fontWeight = 'normal';
    }
  }

  createBaseManager(): void {
    const baseCode = (document.getElementById('base-code') as HTMLInputElement)
      .value;
    this.ApiService.createBaseManager(baseCode)
      .then(res => {
        if (res.success) {
          displayNotificationBanner('Success', 'success');
          location.reload(true);
        } else {
          displayNotificationBanner(res.error, 'warning');
        }
      })
      .catch(err => console.error(err));
  }

  createOrganization(baseId: number): void {
    const orgName = (document.getElementById(
      `create-org-name-${baseId}`
    ) as HTMLInputElement).value;
    const subscriptionCode = (document.getElementById(
      `create-org-subscription-code-${baseId}`
    ) as HTMLInputElement).value;

    this.ApiService.createOrganization(baseId, orgName, subscriptionCode)
      .then(res => {
        if (res.success) {
          displayNotificationBanner(
            `${orgName} was successfully created! 😎👍`,
            'success'
          );
          console.log('success!');
        } else {
          displayNotificationBanner(res.error, 'danger');
          console.log(res.error);
        }
      })
      .catch(err => console.error(err));
  }

  getCost(numberOfSubscribers: number): number {
    return numberOfSubscribers * this.COST_PER_MESSAGE;
  }

  getMaxLength(subscriptionCode: string): number {
    // 3 is for the carriage return, a dash (-), and a space.
    return this.MAX_CHAR_COUNT - subscriptionCode.length - 3;
  }

  sendMessage(orgId: number): void {
    const message = (document.getElementById(
      `text-${orgId}`
    ) as HTMLInputElement).value;

    displayNotificationBanner(
      "You're message is being sent. Standby please. 😁",
      'primary'
    );

    this.ApiService.sendMessage(orgId, message)
      .then(res => {
        if (res.success) {
          displayNotificationBanner(
            "You're message has been accepted. Give us a few minutes to reach everyone. 😎👍",
            'success'
          );
          (document.getElementById(`text-${orgId}`) as HTMLInputElement).value =
            '';
        } else {
          displayNotificationBanner(`${res.error} 😓`, 'danger');
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

  transferOrgOwner(orgId: number): void {}
}

function displayNotificationBanner(
  message: string,
  alertType:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
): void {
  const notificationDiv = document.getElementById('banner');
  const notificationMessage = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">${message}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
  notificationDiv.innerHTML = notificationMessage;

  (async () => {
    await delay(5000);
    notificationDiv.innerHTML = '';
  })();
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
