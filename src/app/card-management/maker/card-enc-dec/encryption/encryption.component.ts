
import { Component, OnInit } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.scss']
})

export class EncryptionComponent implements OnInit {

  institutionId: any;
  cardNo: string = '';
  encryptedCardNo: string = '';

  constructor(
    private rest: RestService,
    private spinner: NgxSpinnerService,
    private alerts: NotificationService
  ) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
  }

  encrypt(): void {
    if (!this.cardNo) {
      this.alerts.errorAlert("Input Required", "Please enter a card number to encrypt.");
      return;
    }

    this.spinner.show();
    const postData = {
      "encryCardNo": this.cardNo
    };

    const url = 'cardmaintain/encryptCard';

    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.encryptedCardNo = res.encryptedCardNumber;
        } else {
          this.spinner.hide();
          this.encryptedCardNo = '';
          this.alerts.errorAlert("Unable to Encrypt", res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        this.encryptedCardNo = '';
        console.error('Encryption error:', error);
        this.alerts.errorAlert("Error", "An error occurred during encryption. Please try again.");
      }
    );
  }
}


