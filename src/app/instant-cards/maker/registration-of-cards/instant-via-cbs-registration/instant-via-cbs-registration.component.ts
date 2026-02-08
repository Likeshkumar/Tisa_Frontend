

import { Component, OnInit } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-instant-via-cbs-registration',
  templateUrl: './instant-via-cbs-registration.component.html',
  styleUrls: ['./instant-via-cbs-registration.component.scss'],
  providers: [DatePipe]
})

export class InstantViaCbsRegistrationComponent implements OnInit {
  accountNumber: any;
  cardNumber: any;
  showCardDetails: boolean = false;
  institutionId: string;
  secondFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  productObj: any;
  productlist: any;
  cardtypeList: any;
  //FeeList: Fee[] = []; /
  myDate: any;
  userData: any;
  data: any;
  Cbslist: any;
  schemeCode: any;
  cbsDataList: any;

  constructor(public rest: RestService,
    private datePipe: DatePipe,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    public alerts: NotificationService,) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.productlist = this.getProductData();

    this.secondFormGroup = this._formBuilder.group({
      branchCode: ['', Validators.required],
      accountNo: ['', Validators.required],
      accountType: ['', Validators.required],
      subAccountTypeDescription: ['', Validators.required],
      currency: ['', Validators.required],
    });

    this.thirdFormGroup = this._formBuilder.group({
      gender: ['', Validators.required],
      customerId: ['', Validators.required],
      encodingName: ['', Validators.required],
      embossingName: ['', Validators.required],
      dob: [''],
      motherName: [''],
    });

    this.fourthFormGroup = this._formBuilder.group({
      address1: ['', Validators.required],
      address2: [''],
      city: [''],
      country: [''],
      mobNo: ['', Validators.required],
      emailId: [''],
    });

    this.firstFormGroup = this._formBuilder.group({
      productcode: ['', Validators.required],
      limitBaseOn: ['', Validators.required],
      typeofCard: ['', Validators.required],
      pingenMethod: ['', Validators.required],
      feeCode: ['', Validators.required],
      chnMask: ['', Validators.required],
    });
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

  retrieveData() {

    this.spinner.show();
    let postData = {
      "instid": this.institutionId,
      "accountno": this.accountNumber,
      "cardNo": this.cardNumber,
      "servicetype": "CARDISSUANCE",
      "requesttype": "INSTANT",
      "username": this.rest.readData('Username'),
    };
    let url = 'cbs/instant/registration';
    this.rest.postValidate(postData, url).subscribe((res: any) => {

      this.secondFormGroup.reset();
      this.thirdFormGroup.reset();
      this.fourthFormGroup.reset();
      this.firstFormGroup.reset();
      if (res.respCode === '00') {
        this.spinner.hide();
        const cardData = res.Cbslist;
        this.cbsDataList = res.Cbslist;
        this.showCardDetails = true;
        if (cardData) {

          this.secondFormGroup.patchValue({
            branchCode: cardData.branchName || '',
            accountNo: cardData.accountNumber || '',
            accountType: cardData.accountTypeDescription || '',
            subAccountTypeDescription: cardData.accountsubType.subAcctDesc || '',
            currency: cardData.currencyDesc || '',
          });

          this.thirdFormGroup.patchValue({
            gender: cardData.gender || '',
            customerId: cardData.customerDetails || '',
            encodingName: cardData.customerName || '',
            embossingName: cardData.customerName || '',
            dob: cardData.dateOfBirth || '',
            //dob: "18042025",
            motherName: cardData.motherName || '',
          });

          this.fourthFormGroup.patchValue({
            address1: cardData.permanentAddress || '',
            address2: cardData.permanentAddress || '',
            city: cardData.city || '',
            country: cardData.country || '',
            mobNo: cardData.mobileNumber || '',
            emailId: cardData.emailId || '',
          });

          this.firstFormGroup.patchValue({
            productcode: cardData.productDesc || '',
            limitBaseOn: cardData.limitBaseOn || '',
            typeofCard: cardData.description || '',
            pingenMethod: cardData.pingenMethod || '',
            feeCode: cardData.schemeDescription || '',
            chnMask: cardData.chnMask || '',
          });


          const reqData = {
            instId: this.institutionId,
            productCode: this.cbsDataList.productCode,
            acctSubType: this.cbsDataList.subAccountTypeCode,
            typeofCard: this.cbsDataList.typeofCard,
          };

          let url = 'get/fee/get';
          this.rest.postValidate(reqData, url).subscribe((res: any) => {

            if (res.respCode === '00') {
              this.data = res.FeeList;
            } else {
              this.data = [];
            }
          });
        }
      }
      else {
        this.spinner.hide();
        this.alerts.errorAlert('Customer Registration', res.respDesc);
      }
    })
  }

  addcustomerEntry() {
    let postData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),

      "prodCode": this.cbsDataList.productCode,
      "limitBaseOn": this.cbsDataList.limitBaseOn,
      "typeOfCard": this.cbsDataList.typeofCard,
      "pinMethod": this.cbsDataList.pingenMethod,
      "feeCode": this.firstFormGroup.value.feeCode,
      "chnMask": this.cbsDataList.chnMask,
      "encryptChn": this.cbsDataList.encryptChn,
      "chn": this.cbsDataList.chn,

      "branchCode": this.cbsDataList.branchCode,
      "accountNo": this.secondFormGroup.value.accountNo,
      "accountType": this.cbsDataList.accountTypeCode,
      "accountSubType": this.cbsDataList.subAccountTypeCode,
      "currency": this.cbsDataList.currencyCode,

      "sex": this.thirdFormGroup.value.gender,
      "customerId": this.thirdFormGroup.value.customerId,
      "encodingName": this.cbsDataList.customerName.trim().toUpperCase(),
      "embossingName": this.cbsDataList.customerName.trim().toUpperCase(),
      "birthdayDate": this.datePipe.transform(this.thirdFormGroup.value.dob, 'ddMMyyyy'),
      "spouseName": this.thirdFormGroup.value.motherName,

      "mailAddressLine1": this.cbsDataList.permanentAddress,
      "mailAddressLine2": this.cbsDataList.permanentAddress,
      "mailCity": this.fourthFormGroup.value.city,
      "mailCountry": this.fourthFormGroup.value.country,
      "mobNo": this.fourthFormGroup.value.mobNo,
      "emailId": this.fourthFormGroup.value.emailId
    }

    let url = 'customer/registration';
    this.rest.postValidate(postData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.data = (res.authList);
        this.alerts.successAlert('Customer Registration', res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.alerts.errorAlert('Customer Registration', res.respDesc);

      }
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}



