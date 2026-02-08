

import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-account-via-cbs',
  templateUrl: './add-new-account-via-cbs.component.html',
  styleUrls: ['./add-new-account-via-cbs.component.scss']
})

export class AddNewAccountViaCbsComponent implements OnInit {

  cardNo: string = '';
  showcardDetails: boolean = false;
  currencylist: any[] = [];
  acctSubTypelist: any[] = [];
  institutionId: any;
  addonAccForm!: FormGroup;
  acctTypeList: any[] = [];
  existingAccounts: any[] = [];
  acctSubTypeList: any[] = [];
  showNewAccountInput = false;
  canSubmit = false;
  accountNo: string = '';
  newAccountDetails: any[] = [];


  constructor(
    private alerts: NotificationService,
    private rest: RestService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
  }

  createAccountRow(account?: any): FormGroup {
    return this._formBuilder.group({
      acctType: [account?.acctType || '', Validators.required],
      acctSubType: [account?.acctSubType || '', Validators.required],
      currency: [account?.currency || '', Validators.required],
      accountNumber: [account?.accountNumber || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      accountPriority: [account?.accountPriority || '']
    });
  }

  retrieveCardDetails() {
    this.spinner.show();
    const postData = {
      cardNo: this.cardNo,
      username: this.rest.readData('Username'),
      instId: this.institutionId,
    };

    this.rest.postValidate(postData, 'cardmaintain/addonAccountdetails').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.showcardDetails = true;
          this.showNewAccountInput = true;
          this.existingAccounts = res.AddonCardDetailsList;
        } else {
          this.alerts.errorAlert("Add on Account", res.respDesc);
        }
      },
    );
  }

  retrieveNewAccount() {
    this.spinner.show();
    const postData = {
      accountno: this.accountNo,
      "username": this.rest.readData('Username'),
      "instid": this.institutionId,
      "cardNo": this.cardNo,
      "servicetype": "CARDISSUANCE",
      "requesttype": "ADDONACCOUNT",
    };

    this.rest.postValidate(postData, 'cbs/addonAccount').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.canSubmit = true;
          this.newAccountDetails = [];
          if (res.CbsAddonlist && typeof res.CbsAddonlist === 'object') {
            this.newAccountDetails.push(res.CbsAddonlist);
          }
          this.showNewAccountInput = this.newAccountDetails.length > 0;
        } else {
          this.alerts.errorAlert("Add on Account", res.respDesc);
        }
      },
      error => {
        this.spinner.hide();
        this.alerts.errorAlert('Add on Account', 'Failed to retrieve card details.');
      }
    );
  }

  addOnAccount() {
    this.spinner.show();
    const postData = {
      instId: this.institutionId,
      cardNo: this.cardNo,
      username: this.rest.readData('Username'),
      primaryAccountDetails: this.existingAccounts.map(account => ({
        accountNumber: account.accountNumber,
        acctCode: account.acctCode,
        acctType: account.acctType,
        subAcctType: account.subAcctType,
        subAcctDesc: account.subAcctDesc,
        currencyCode: account.currencyCode,
        currency: account.currency,
        accountPriority: account.accountPriority,
      })),
      secondaryAccountDetails: this.newAccountDetails.map(account => ({
        accountNumber: account.accountNumber,
        acctCode: account.acctCode,
        acctType: account.acctType,
        subAcctType: account.subAcctType,
        subAcctDesc: account.subAcctDesc,
        currencyCode: account.currencyCode,
        currency: account.currency,
        accountPriority: account.accountPriority,
      })),
    };

    this.rest.postValidate(postData, 'maintainence/addAddonAccount').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.alerts.successAlert("Add on Account", res.respDesc);
          setTimeout(() => this.reloadCurrentRoute(), 3000);
        } else {
          this.alerts.errorAlert("Add on Account", res.respDesc);
        }
      },
      error => {
        this.spinner.hide();
        this.alerts.errorAlert('Add on Account', 'Failed to add account.');
      }
    );
  }


  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  cancelAddOnAccount() {
    this.cardNo = '';
    this.accountNo = '';
    this.showcardDetails = false;
    this.showNewAccountInput = false;
    this.canSubmit = false;
  }
}

