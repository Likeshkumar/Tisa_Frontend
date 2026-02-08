import { Component, OnInit } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-via-cbs-pers',
  templateUrl: './via-cbs-pers.component.html',
  styleUrls: ['./via-cbs-pers.component.scss'],
  providers: [DatePipe]
})

export class ViaCbsPersComponent implements OnInit {
  
  accountNumber: any;
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
    });
  }


  getProductData() {

    const postdata = {
      "instId": this.institutionId,
      "binType": "P"
    };

    // const url = 'get/product';
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

  getFee() {
    const formValues = this.firstFormGroup.value; // Get form values

    if (!formValues.productcode) {
      console.warn('Skipping getFee(): Product Code is missing');
      return;
    }

    if (!this.cbsDataList?.accountsubType?.subAcctType) {
      console.warn('Skipping getFee(): Account Sub Type is missing');
      return;
    }

    const reqData = {
      instId: this.institutionId,
      productCode: formValues.productcode.productCode,
      acctSubType: this.cbsDataList.accountsubType.subAcctType,
      typeofCard: formValues.typeofCard.typeofCard
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


  search() {

    this.spinner.show();
    let postData = {
      "instid": this.institutionId,
      "accountno": this.accountNumber,
      "servicetype": "CARDISSUANCE",
      "requesttype": "PERSONALIZE",
      "username": this.rest.readData('Username'),
    };
    let url = 'cbs/registration';
    this.rest.postValidate(postData, url).subscribe((res: any) => {

      this.firstFormGroup.reset();
      this.secondFormGroup.reset();
      this.thirdFormGroup.reset();
      this.fourthFormGroup.reset();

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
            subAccountTypeDescription: cardData.subAccountTypeDescription || '',
            currency: cardData.currencyDesc || '',
          });

          this.thirdFormGroup.patchValue({
            gender: cardData.gender || '',
            customerId: cardData.customerDetails || '',
            encodingName: cardData.customerName || '',
            embossingName: cardData.customerName || '',
            dob: cardData.dateOfBirth || '',
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
        }
      }
      else {
        this.spinner.hide();
        this.alerts.errorAlert('Registration of Cards', res.respDesc);
      }
    })
  }

  addcustomerEntry() {
    let postData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      "bin": this.firstFormGroup.value.productcode.productCode,
      "typeOfCard": this.firstFormGroup.value.typeofCard.typeofCard,
      "limitBaseOn": this.firstFormGroup.value.limitBaseOn,
      "pinMethod": this.firstFormGroup.value.pingenMethod,
      "branchCode": this.cbsDataList.branchCode,
      "accountType": this.cbsDataList.accountTypeCode,
      "acctSubType": this.cbsDataList.subAccountTypeCode,
      "accountNo": this.secondFormGroup.value.accountNo,
      "feeCode": this.firstFormGroup.value.feeCode,
      "currency": this.cbsDataList.currencyCode,
      "sex": this.thirdFormGroup.value.gender,
      "customerId": this.thirdFormGroup.value.customerId,
      "encodingName": this.cbsDataList.customerName.trim().toUpperCase(),
      "embossingName": this.cbsDataList.customerName.trim().toUpperCase(),
      "birthdayDate": this.thirdFormGroup.value.dob,
      "spouseName": this.thirdFormGroup.value.motherName,
      "addressLine1": this.cbsDataList.permanentAddress,
      "addressLine2": this.cbsDataList.permanentAddress,
      "city": this.fourthFormGroup.value.city,
      "state": this.fourthFormGroup.value.state,
      "pincode": this.fourthFormGroup.value.pincode,
      "country": this.fourthFormGroup.value.country,
      "mobNo": this.fourthFormGroup.value.mobNo,
      "emailId": this.fourthFormGroup.value.emailId
    }

    let url = 'personalized/card/generation';
    this.rest.postValidate(postData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.data = (res.authList);
        this.alerts.successAlert("Registration of Cards", res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.alerts.errorAlert("Registration of Cards", res.respDesc);

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


