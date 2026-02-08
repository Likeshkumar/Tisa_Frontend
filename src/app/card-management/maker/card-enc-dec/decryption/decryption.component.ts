

import { Component, OnInit } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-decryption',
  templateUrl: './decryption.component.html',
  styleUrls: ['./decryption.component.scss']
})

export class DecryptionComponent implements OnInit {

  institutionId: any;
  cardNo: string = '';
  decryptedCardNo: string = '';
  constructor(
    private rest: RestService,
    private spinner: NgxSpinnerService,
    private alerts: NotificationService
  ) { }

  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
  }

  decrypt(): void {
    if (!this.cardNo) {
      this.alerts.errorAlert("Input Required", "Please enter an encrypted card number to decrypt.");
      return;
    }

    this.spinner.show();
    const postData = {
      "decryCardNo": this.cardNo
    };

    const url = 'cardmaintain/decryptCard';

    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.decryptedCardNo = res.decryptedCardNumber;
        } else {
          this.spinner.hide();
          this.decryptedCardNo = '';
          this.alerts.errorAlert("Unable to Decrypt", res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        this.decryptedCardNo = '';
        console.error('Decryption error:', error);
        this.alerts.errorAlert("Error", "An error occurred during decryption. Please try again.");
      }
    );
  }
}

