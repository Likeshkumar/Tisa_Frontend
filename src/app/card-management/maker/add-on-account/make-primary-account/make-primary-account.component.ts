
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-primary-account',
  templateUrl: './make-primary-account.component.html',
  styleUrls: ['./make-primary-account.component.scss']
})


export class MakePrimaryAccountComponent implements OnInit {
  
  cardNo: string = '';
  showcardDetails: boolean = false;
  institutionId: any;
  existingAccounts: any[] = [];
  addonAccForm!: FormGroup;
  //selectedSwapIndex:any;
  selectedSwapIndex: number | null = null;
  constructor(
    private alerts: NotificationService,
    private rest: RestService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.initForm();
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
      cardNumber: this.cardNo,
      username: this.rest.readData('Username'),
      instId: this.institutionId,
    };

    this.rest.postValidate(postData, 'maintainence/switchacct/details').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.showcardDetails = true;
          this.existingAccounts = res.AddonCardDetailsList;

          const controlArray = this.addonAccForm.get('accounts') as FormArray;
          controlArray.clear();

          this.existingAccounts.forEach(account => {
            controlArray.push(this.createAccountRow({
              acctType: `${account.acctCode} - ${account.acctType}`,
              acctSubType: `${account.subAcctType} - ${account.subAcctDesc}`,
              currency: `${account.currencyCode} - ${account.currency}`,
              accountNumber: account.accountNumber,
              accountPriority: account.accountPriority
            }));
          });

        } else {
          this.alerts.errorAlert("Add on Account Switch", res.respDesc);
        }
      }
    );
  }

  addOnAccountSwitch() {
    if (this.selectedSwapIndex === null) {
      this.alerts.errorAlert('Add on Account Switch', 'Please select an account to make it primary.');
      return;
    }

    this.spinner.show();

    // Set priorities
    const allAccounts = this.accountRows.getRawValue().map((account, index) => {
      return {
        ...account,
        accountPriority: index === this.selectedSwapIndex ? 'Primary' : 'Secondary'
      };
    });

    const primaryAccount = allAccounts.filter(account => account.accountPriority === 'Primary');

    const postData = {
      instId: this.institutionId,
      cardNo: this.cardNo,
      username: this.rest.readData('Username'),
      accounts: primaryAccount
    };

    this.rest.postValidate(postData, 'maintainence/switch/addonacct').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.alerts.successAlert('Add on Account Switch', res.respDesc);
          setTimeout(() => {
            this.reloadCurrentRoute();
          }, 3000);
        } else {
          this.alerts.errorAlert('Add on Account Switch', res.respDesc);
        }
      }
    );
  }

  onSwapSelected(index: number) {
    this.selectedSwapIndex = index;
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

}

