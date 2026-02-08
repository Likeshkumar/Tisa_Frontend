
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-instant-manual-registration',
  templateUrl: './instant-manual-registration.component.html',
  styleUrls: ['./instant-manual-registration.component.scss'],
  providers: [DatePipe]
})

export class InstantManualRegistrationComponent implements OnInit {

  selectedItem: any;
  isLinear = true;
  //firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  showcardDetails: Boolean = false;
  cardNo: any;
  productlist: any;
  branchlist: any;
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
  acctSubTypelist = [];
  currencylist = [];
  appDate: any;
  applicationNo: any;
  cardtype: any;
  expDate: any;
  noofcards: any;
  customerData: any;
  myDate: any;
  cardtypeList: any;
  accountData: any = [];
  accountProductlist: any;
  accountproductvalue: any;
  acctsubtype: any;
  subtypeList: any;
  servicelist: any;
  acctTypeList: any = [];
  acctSubTypeList: any = [];
  cmsData: any;

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public alerts: NotificationService,
    public rest: RestService,
    private datePipe: DatePipe,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.institutionId = this.rest.readData('InstituteId');
    this.productlist = this.getProductData();
    this.branchlist = this.getBranchData();
    this.formInt();
    this.getAccType();
    this.getCurrency();
    this.getCmsDat();
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
      "binType": "I"
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
    };
    let url = 'get/branch';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.branchlist = res.branchList;
      }
    });
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
      productCode: this.customerData.prodCode,
      acctSubType: this.secondFormGroup.value.acctSubType,
      typeofCard: this.customerData.typeOfCard
    };

    let url = 'get/fee/get';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.data = res.FeeList;
      }
    });
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


  formInt() {
    this.secondFormGroup = this._formBuilder.group({
      accountNo: ['', [Validators.required, Validators.pattern("^[0-9]{16}$")]],
      acctType: ['', Validators.required],
      acctSubType: ['', Validators.required],
      feeCode: ['', Validators.required],
      currency: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      gender: ['', Validators.required],
      customerId: [''],
      encodingname: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
      dateofBirth: ['', [this.noFutureDateValidator()]],
      spouseName: ['', [Validators.maxLength(24), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
    });
    this.fourthFormGroup = this._formBuilder.group({
      // addressline1: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]],
      // addressline2: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]],
      // city: ['', ''],
      // state: ['', ''],
      // pincode: ['', ''],
      // country: ['', ''],
      // autoFillMailingAddress: [false],
      mailaddressline1: ['', [Validators.required, Validators.maxLength(35), Validators.pattern("^[a-zA-Z0-9 ,./'-]*$")]],
      mailaddressline2: ['', [Validators.maxLength(35), Validators.pattern("^[a-zA-Z0-9 ,./'-]*$")]],
      mailcity: ['', [Validators.maxLength(35), Validators.pattern("^[a-zA-Z ]*$")]],
      // mailstate: [''],
      // mailpincode: [''],
      mailcountry: ['', [Validators.maxLength(35), Validators.pattern("^[a-zA-Z ]*$")]],
      mobNo: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]],
      emailId: ['', [Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })

  }

  search() {
    this.spinner.show();
    let postData = {
      cardNo: this.cardNo,
      processStatus: '05'

    };
    let url = 'customer/details';
    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.customerData = res.cardDetails[0];
          if (res.cardDetails[0]) {
            this.showcardDetails = true;
          } else {
            this.spinner.hide();
            this.alerts.showAlert('Customer Registration', res.respDesc);
          }
        } else {
          this.spinner.hide();
          this.alerts.errorAlert('Customer Registration', res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error('API Error:', error);
        this.alerts.errorAlert('An error occurred while fetching customer details.', 'Customer Details Fetch API Error');
      }
    );

  }


  addcustomerEntry() {
    this.spinner.show();
    let postData = {
      "username": this.rest.readData('Username'),
      "cvv1": this.customerData.cvv1,
      "cvv2": this.customerData.cvv2,
      "processStatus": this.customerData.processStatus,
      "orgChn": this.customerData.orgChn,
      "serviceCode": this.customerData.serviceCode,
      "chnMask": this.customerData.chnMask,
      "regDate": this.customerData.regDate,
      //"appDate": this.customerData.appDate,
      "expDate": this.customerData.expDate,
      "result": this.customerData.result,
      "encryptChn": this.customerData.encryptChn,
      "lmtBasedOn": this.customerData.lmtBasedOn,
      "crdType": this.customerData.crdType,
      "customerId": this.thirdFormGroup.value.customerId,
      "pinOffset": this.customerData.pinOffset,
      "cafRecStatus": this.customerData.cafRecStatus,
      "authDate": this.customerData.authDate,
      "batchNo": this.customerData.batchNo,
      "appNumber": this.customerData.appNumber,
      "insFlag": this.customerData.insFlag,
      "cbd": this.customerData.cbd,
      "typeOfCard": this.customerData.typeOfCard,
      "acctSubType": this.secondFormGroup.value.acctSubType,
      "feeCode": this.secondFormGroup.value.feeCode,
      "chn": this.customerData.chn,
      "crdTypeBank": this.customerData.crdTypeBank,
      "services": this.customerData.services,
      "icvv": this.customerData.icvv,
      "userName": this.customerData.userName,
      "instId": this.customerData.instId,
      "prodCode": this.customerData.prodCode,
      "encDate": this.customerData.encDate,
      "branchCode": this.customerData.PBranchCode,
      "rnfCardStatus": this.customerData.rnfCardStatus,
      "issDate": this.customerData.issDate,
      "crdStatus": this.customerData.crdStatus,
      // "subProduct": this.firstFormGroup.value.subType,
      // "limitBaseOn": this.firstFormGroup.value.limitBaseOn,
      "subProduct": '15',
      "limitBaseOn": 'CT',
      // "renewalCard": this.firstFormGroup.value.renewalCard,
      // "pinMethod": this.firstFormGroup.value.pingenMethod,
      //"branchCode": this.secondFormGroup.value.branchcode.branchCode,
      "accountType": this.secondFormGroup.value.acctType,
      "accountNo": this.secondFormGroup.value.accountNo,
      "accountSubType": this.secondFormGroup.value.acctSubType,
      "currency": this.secondFormGroup.value.currency,
      "sex": this.thirdFormGroup.value.gender,
      "encodingName": this.thirdFormGroup.value.encodingname.trim().toUpperCase(),
      //"embossingName": this.thirdFormGroup.value.embossingname.trim().toUpperCase(),
      "birthdayDate": this.datePipe.transform(this.thirdFormGroup.value.dateofBirth, 'ddMMyyyy'),
      //"annualIncome": this.thirdFormGroup.value.annualIncome,
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
      // "mailState": this.fourthFormGroup.value.mailstate,
      // "mailPincode": this.fourthFormGroup.value.mailpincode,
      "mailCountry": this.fourthFormGroup.value.mailcountry,
      "mobNo": this.fourthFormGroup.value.mobNo,
      "emailId": this.fourthFormGroup.value.emailId
    };

    let url = 'customer/registration';
    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.alerts.successAlert('Customer Registration', res.respDesc);
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.alerts.errorAlert('Customer Registration', res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error('API Error:', error);
        this.alerts.errorAlert('An error occurred while adding the customer entry.', 'Error Adding Customer Entry');
      }
    );
  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
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

  backtosearch() {
    this.showcardDetails = false;
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();
  }

  noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const currentDate = new Date();
      const inputDate = new Date(control.value);
      return inputDate > currentDate ? { 'invalidDate': true } : null;
    };
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

