
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-manual-entry-pers',
  templateUrl: './manual-entry-pers.component.html',
  styleUrls: ['./manual-entry-pers.component.scss'],
  providers: [DatePipe]
})

export class ManualEntryPersComponent implements OnInit {

  userData: any;
  selectedItem: any;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  cardNo: any;
  productlist: any;
  branchList: any;
  acctSub: any;
  productObj: any;
  branchObj: any;
  subtype: any;
  acctType: any;
  institutionId: any;
  subtypelist: any;
  data: any;
  limitName: string = "";
  feeName: String = "";
  services: any;
  regDate: any;
  cmsData: any;
  acctTypeList = [];
  currencylist = [];
  FeeList: [];
  appDate: any;
  applicationNo: any;
  cardtype: any;
  expDate: any;
  noofcards: any;
  customerData: any;
  myDate: any;
  cardtypeList: any;
  accountData: any = [];
  accountproductvalue: any;
  acctsubtype: any;
  subtypeList: any;
  servicelist: any;
  autoFillMailingAddress: boolean = false;
  acctSubTypeList: any = [];
  feeDisplay: any;
  feeCodes: any[] = [];  // Declare feeCodes as an array


  individualFields = [
    { label: 'Withdraw Amount', controlName: 'withdrawAmount', maxlength: 6 },
    { label: 'Withdraw Count', controlName: 'withdrawCount', maxlength: 2 },
    { label: 'Purchase Amount', controlName: 'purchaseAmount', maxlength: 6 },
    { label: 'Purchase Count', controlName: 'purchaseCount', maxlength: 2 },
    { label: 'Transfer Amount', controlName: 'transferAmount', maxlength: 6 },
    { label: 'Transfer Count', controlName: 'transferCount', maxlength: 2 }
  ];


  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    public alerts: NotificationService,
    public rest: RestService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.productlist = this.getProductData();
    this.branchList = this.getBranchData();
    this.formInt();
    this.getCurrency();
    this.getAccType();
    this.getCmsDat();
  }

  formInt() {
    this.firstFormGroup = this._formBuilder.group({
      productcode: ['', Validators.required],
      limitBaseOn: ['CT', Validators.required],
      typeofCard: ['', Validators.required],
      withdrawAmount: [''],
      withdrawCount: [''],
      purchaseAmount: [''],
      purchaseCount: [''],
      transferAmount: [''],
      transferCount: [''],
      pingenMethod: ['G', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      branchcode: ['', Validators.required],
      accountNo: ['', [Validators.required, Validators.pattern("^[0-9]{16}$")]],
      acctSubType: ['', Validators.required],
      acctType: ['', Validators.required],
      feeCode: ['', Validators.required],
      currency: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      customerId: [''],
      gender: ['', Validators.required],
      encodingname: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
      embossingname: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
      dateofBirth: ['', [this.noFutureDateValidator()]],
      spouseName: ['', [Validators.maxLength(24), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
    });
    this.fourthFormGroup = this._formBuilder.group({
      // addressline1: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]],
      // addressline2: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]],
      // city: [''],
      // state: [''],
      // pincode: [''],
      // country: [''],
      // autoFillMailingAddress: [false],
      mailaddressline1: ['', [Validators.required, Validators.maxLength(35), Validators.pattern("^[a-zA-Z0-9 ,./'-]*$")]],
      mailaddressline2: ['', [Validators.maxLength(35), Validators.pattern("^[a-zA-Z0-9 ,./'-]*$")]],
      mailcity: [''],
      // mailstate: [''],
      // mailpincode: [''],
      mailcountry: [''],
      mobNo: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]],
      emailId: ['', [Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })
  }


  getCmsDat() {
    const postdata = {
      "instId": this.institutionId,
    };

    const url = 'get/cmsDat';
    this.rest.postValidate(postdata, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.cmsData = res.CmsDataList[0];
        this.setCustomerIdValidators();
      }
    });
  }

  setCustomerIdValidators() {
    const customerIdControl = this.thirdFormGroup.get('customerId');
    if (this.cmsData?.custid_gen === 'Manual') {
      customerIdControl?.setValidators([Validators.required, Validators.pattern("^[0-9]{6}$")]);
    } else {
      customerIdControl?.clearValidators();
    }
    customerIdControl?.updateValueAndValidity();
  }

  getProductData() {

    const postdata = {
      "instId": this.institutionId,
      "binType": "P"
    };

    //const url = 'get/product';
    const url = 'get/cardgenproduct';
    this.rest.postValidate(postdata, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.productlist = res.productList;
        }
      }
    );
  }

  getBranchData() {
    const reqData = {
      "instId": this.institutionId,
    }
    let url = 'get/branch';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.branchList = res.branchList;

      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Card type Details');
      }
    })
  }

  gettypeofCard() {

    const reqData = {
      "instId": this.institutionId,
      "productCode": this.productObj?.productCode
    }
    let url = 'get/cardType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.cardtypeList = res.cardtypeList;

      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Card type Details');
      }
    })
  }

  getCurrency() {
    let url = 'get/currency';
    this.rest.getwithHeader(url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.currencylist = res.currencyList;

      } else {
        this.alerts.errorAlert(res.respDesc, 'currencylist Details');
      }
    })
  }

  getAccType() {
    let reqData = {
      "instId": this.institutionId,
    }
    let url = 'get/acctType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.acctTypeList = res.accountTypeList;
      }
    })
  }


  getAccSubTypeList() {
    const reqData = {
      "instId": this.institutionId,
      "acctType": this.secondFormGroup.value.acctType
    }
    let url = 'get/acctSubType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.acctSubTypeList = res.accountsubType;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Card type Details');
      }
    })
  }


  getFee() {
    const reqData = {
      instId: this.institutionId,
      productCode: this.productObj?.productCode,
      acctSubType: this.secondFormGroup.value.acctSubType,
      typeofCard: this.firstFormGroup.value.typeofCard.typeofCard
    };

    let url = 'get/fee/get';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.data = res.FeeList;
      }
    });
  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  addcustomerEntry() {
    this.spinner.show();
    if (this.firstFormGroup.value.limitBaseOn === 'IN') {
      this.individualFields.forEach(field => {
        postData[field.controlName] = this.firstFormGroup.value[field.controlName] || '';
      });
    }

    let postData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      "bin": this.firstFormGroup.value.productcode.productCode,
      "typeOfCard": this.firstFormGroup.value.typeofCard.typeofCard,
      "limitBaseOn": this.firstFormGroup.value.limitBaseOn,
      "pinMethod": this.firstFormGroup.value.pingenMethod,
      "branchCode": this.secondFormGroup.value.branchcode.branchCode,
      "accountType": this.secondFormGroup.value.acctType,
      "acctSubType": this.secondFormGroup.value.acctSubType,
      "accountNo": this.secondFormGroup.value.accountNo,
      "feeCode": this.secondFormGroup.value.feeCode,
      "currency": this.secondFormGroup.value.currency,
      "sex": this.thirdFormGroup.value.gender,
      "customerId": this.thirdFormGroup.value.customerId,
      "encodingName": this.thirdFormGroup.value.encodingname.trim().toUpperCase(),
      "embossingName": this.thirdFormGroup.value.embossingname.trim().toUpperCase(),
      "birthdayDate": this.datePipe.transform(this.thirdFormGroup.value.dateofBirth, 'dd-MM-yyyy'),
      "spouseName": this.thirdFormGroup.value.spouseName,
      "addressLine1": this.fourthFormGroup.value.addressline1,
      "addressLine2": this.fourthFormGroup.value.addressline2,
      "city": this.fourthFormGroup.value.city,
      "state": this.fourthFormGroup.value.state,
      "pincode": this.fourthFormGroup.value.pincode,
      "country": this.fourthFormGroup.value.country,
      "mailAddressLine1": this.fourthFormGroup.value.mailaddressline1,
      "mailAddressLine2": this.fourthFormGroup.value.mailaddressline2,
      "mailCity": this.fourthFormGroup.value.mailcity,
      "mailState": this.fourthFormGroup.value.mailstate,
      "mailPincode": this.fourthFormGroup.value.mailpincode,
      "mailCountry": this.fourthFormGroup.value.mailcountry,
      "mobNo": this.fourthFormGroup.value.mobNo,
      "emailId": this.fourthFormGroup.value.emailId
    }

    let url = 'personalized/card/generation';
    this.rest.postValidate(postData, url).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.respCode == '00') {
          this.spinner.hide();
          this.alerts.successAlert("Card Registration", res.respDesc);
          setTimeout(() => {
            this.reloadCurrentRoute();
          }, 3000)
        } else {
          this.spinner.hide();
          this.alerts.errorAlert("Card Registration", ` ${res.respDesc}`);
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error("API Error:", err);
        let statusCode = err.status || "Unknown Status";
        let errorMessage = err.error?.error || err.message || "Service error occurred";
        let errorPath = err.error?.path || "N/A";
        let backendRespCode = err.error?.respCode || "N/A";
        let backendRespDesc = err.error?.respDesc || "No additional details";

        let errorDetails = `
            Status Code: ${statusCode}
            Error: ${errorMessage}
            API Path: ${errorPath}
            Response Code: ${backendRespCode}
            Message: ${backendRespDesc}
          `;
        this.alerts.errorAlert("Card Registration", errorDetails);
      }
    });
  }

  autoFillMailing() {
    const autoFill = this.fourthFormGroup.get('autoFillMailingAddress')?.value;
    if (autoFill) {
      this.fourthFormGroup.patchValue({
        mailaddressline1: this.fourthFormGroup.get('addressline1')?.value,
        mailaddressline2: this.fourthFormGroup.get('addressline2')?.value,
        mailcity: this.fourthFormGroup.get('city')?.value,
        mailstate: this.fourthFormGroup.get('state')?.value,
        mailpincode: this.fourthFormGroup.get('pincode')?.value,
        mailcountry: this.fourthFormGroup.get('country')?.value,
      });
    } else {
      this.fourthFormGroup.patchValue({
        mailaddressline1: '',
        mailaddressline2: '',
        mailcity: '',
        mailstate: '',
        mailpincode: '',
        mailcountry: '',
      });
    }
  }

  noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const currentDate = new Date();
      const inputDate = new Date(control.value);
      return inputDate > currentDate ? { 'invalidDate': true } : null;
    };
  }

}



