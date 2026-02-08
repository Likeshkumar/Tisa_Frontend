

import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-account',
  templateUrl: './add-new-account.component.html',
  styleUrls: ['./add-new-account.component.scss']
})

export class AddNewAccountComponent implements OnInit {

  cardNo: string = '';
  showcardDetails: boolean = false;
  currencylist: any[] = [];
  acctSubTypelist: any[] = [];
  institutionId: any;
  addonAccForm!: FormGroup;
  acctTypeList: any[] = [];
  account: any[] = [];
  existingAccounts: any[] = [];
  acctSubTypeList: any[] = [];
  constructor(
    private alerts: NotificationService,
    private rest: RestService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.getCurrency();
    this.getAccType();
    this.initForm();
  }

  getAccType() {
    let reqData = {
      "instId": this.institutionId,
    }
    let url = 'get/acctType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.acctTypeList = res.accountTypeList;
      } else {
        this.alerts.errorAlert(res.respDesc, 'acctSubTypelist Details');
      }
    })
  }

  getAccSubTypeList(selectedAcctType: string) {
    const reqData = {
      "instId": this.institutionId,
      "acctType": selectedAcctType
    };
    let url = 'get/acctSubType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.acctSubTypeList = res.accountsubType;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Account Sub Type Details');
      }
    });
  }


  getCurrency() {
    this.rest.getwithHeader('get/currency').subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.currencylist = res.currencyList;
        } else {
          this.alerts.errorAlert(res.respDesc, 'Currency List Details');
        }
      },
      error => {
        this.alerts.errorAlert('An error occurred while fetching currencies.', 'Currency List Details');
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
    this.showcardDetails = false;
  }

  initForm() {
    this.addonAccForm = this._formBuilder.group({
      accounts: this._formBuilder.array([])
    });

    if (this.existingAccounts.length > 0) {
      this.existingAccounts.forEach(account => {
        this.accountRows.push(this.createAccountRow(account));
      });
    } else {
      this.accountRows.push(this.createAccountRow());
    }
  }

  get accountRows(): FormArray {
    return this.addonAccForm.get('accounts') as FormArray;
  }

  createAccountRow(account?: any): FormGroup {
    return this._formBuilder.group({
      acctType: [account?.acctType || '', Validators.required],
      acctSubType: [account?.acctSubType || '', Validators.required],
      currency: [account?.currency || '', Validators.required],
      accountNumber: [account?.accountNumber || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
      accountPriority: [{ value: account?.accountPriority || '', disabled: true }, Validators.required]
    });
  }

  retrieveData() {
    this.spinner.show();
    const postData = {
      "cardNo": this.cardNo,
      "username": this.rest.readData('Username'),
      "instId": this.institutionId,
    };

    this.rest.postValidate(postData, 'cardmaintain/addonAccountdetails').subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.showcardDetails = true;
          this.existingAccounts = res.AddonCardDetailsList;
          this.updateAccountPriority();
        } else {
          this.spinner.hide();
          this.alerts.errorAlert("Add on Account", res.respDesc);
        }
      }
    );
  }

  addAccountRow() {
    if (this.accountRows.length < 5) {
      const nextPriority = this.getNextAccountPriority();
      this.accountRows.push(
        this._formBuilder.group({
          acctType: ['', Validators.required],
          acctSubType: ['', Validators.required],
          currency: ['', Validators.required],
          accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
          accountPriority: [{ value: nextPriority, disabled: true }]
        })
      );
    } else {
      this.alerts.errorAlert("Add On Account", 'You can add a maximum of 5 accounts');
    }
  }


  removeAccountRow() {
    if (this.accountRows.length > 0) {
      this.accountRows.removeAt(this.accountRows.length - 1);
    }
  }

  updateAccountPriority() {
    this.accountRows.controls.forEach((control) => {
      control.get('accountPriority')?.setValue('Secondary');
    });
  }

  // updateAccountPriority() {
  //   const secondaryCount = this.existingAccounts.filter(acc => acc.accountPriority.startsWith('Secondary')).length;
  //   this.accountRows.controls.forEach((control, index) => {
  //     control.get('accountPriority')?.setValue(`Secondary${secondaryCount + index + 1}`);
  //   });
  // }

  getNextAccountPriority(): string {
    const allPriorities = [
      ...this.existingAccounts.map(acc => acc.accountPriority),
      ...this.accountRows.controls.map(row => row.get('accountPriority')?.value)
    ];
    if (!allPriorities.includes('Primary')) {
      return 'Primary';
    }
    return 'Secondary';
  }

  // getNextAccountPriority(): string {
  //   const allPriorities = [
  //     ...this.existingAccounts.map(acc => acc.accountPriority),
  //     ...this.accountRows.controls.map(row => row.get('accountPriority')?.value)
  //   ];

  //   if (!allPriorities.includes('Primary')) {
  //     return 'Primary';
  //   }

  //   const secondaryLevels = allPriorities
  //     .filter(priority => priority.startsWith('Secondary'))
  //     .map(priority => {
  //       const match = priority.match(/^Secondary(\d*)$/);
  //       return match ? parseInt(match[1] || '0', 10) : 0;
  //     });

  //   const nextSecondaryLevel = Math.max(0, ...secondaryLevels) + 1;
  //   return nextSecondaryLevel === 1 ? 'Secondary' : `Secondary${nextSecondaryLevel}`;
  // }



  addOnAccount() {
    this.spinner.show();
    const postData = {
      "instId": this.institutionId,
      "cardNo": this.cardNo,
      "username": this.rest.readData('Username'),
      "accounts": this.accountRows.getRawValue(),
      "existingAccounts": this.existingAccounts
    };

    this.rest.postValidate(postData, 'cardmaintain/addAddonAccount').subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.alerts.successAlert("Add on Account", res.respDesc);
          setTimeout(() => {
            this.reloadCurrentRoute();
          }, 3000);
        } else {
          this.spinner.hide();
          this.alerts.errorAlert("Add on Account", res.respDesc);
        }
      }
    );
  }


}

