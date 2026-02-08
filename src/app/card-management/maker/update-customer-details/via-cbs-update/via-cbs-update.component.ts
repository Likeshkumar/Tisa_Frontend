
import { Component, OnInit } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-via-cbs-update',
  templateUrl: './via-cbs-update.component.html',
  styleUrls: ['./via-cbs-update.component.scss'],
  providers: [DatePipe]
})

export class ViaCbsUpdateComponent implements OnInit {

  dataSource = new MatTableDataSource<PeriodicElement>();
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
  myDate: any;
  userData: any;
  data: any;
  Cbslist: any;
  schemeCode: any;
  cbsDataList: any;
  selectedOption: string = '';
  userInput: string = '';
  isEditMode = false;
  customerData: any;
  acctSubTypeList: any = [];
  showrecords: boolean = false;
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

    this.thirdFormGroup = this._formBuilder.group({
      gender: ['', Validators.required],
      customerId: ['', Validators.required],
      // encodingName: ['', Validators.required],
      embossingName: ['', Validators.required],
      dateofBirth: [''],
      motherName: [''],
    });

    this.fourthFormGroup = this._formBuilder.group({
      mailaddressline1: ['', Validators.required],
      mailaddressline2: [''],
      mailcity: [''],
      mailcountry: [''],
      mobNo: ['', Validators.required],
      emailId: [''],
    });
  }

  // search() {

  //   this.spinner.show();
  //   let postData = {
  //     "instid": this.institutionId,
  //     "accountno": this.accountNumber,
  //     "servicetype": "CARDISSUANCE",
  //     "requesttype": "PERSONALIZE",
  //     "username": this.rest.readData('Username'),
  //   };
  //   let url = 'cbs/registration';
  //   this.rest.postValidate(postData, url).subscribe((res: any) => {

  //     this.secondFormGroup.reset();
  //     this.thirdFormGroup.reset();
  //     this.fourthFormGroup.reset();

  //     if (res.respCode === '00') {
  //       this.spinner.hide();
  //       const cardData = res.Cbslist;
  //       this.cbsDataList = res.Cbslist;
  //       this.showCardDetails = true;
  //       if (cardData) {
  //         this.thirdFormGroup.patchValue({
  //           gender: cardData.gender || '',
  //           customerId: cardData.customerDetails || '',
  //           encodingName: cardData.customerName || '',
  //           embossingName: cardData.customerName || '',
  //           dob: cardData.dateOfBirth || '',
  //           motherName: cardData.motherName || '',
  //         });

  //         this.fourthFormGroup.patchValue({
  //           address1: cardData.permanentAddress || '',
  //           address2: cardData.permanentAddress || '',
  //           city: cardData.city || '',
  //           country: cardData.country || '',
  //           mobNo: cardData.mobileNumber || '',
  //           emailId: cardData.emailId || '',
  //         });
  //       }
  //     }
  //     else {
  //       this.spinner.hide();
  //       this.alerts.errorAlert('Registration of Cards', res.respDesc);
  //     }
  //   })
  // }

  getLabelForSelection(option: string): string {
    switch (option) {
      case 'account':
        return 'Enter the Account Number';
      case 'customerName':
        return 'Enter the Customer Name';
      case 'customerId':
        return 'Enter the Customer ID';
      case 'cardNumber':
        return 'Enter the Card Number';
      default:
        return 'Enter Value';
    }
  }

  getPlaceholderForSelection(option: string): string {
    switch (option) {
      case 'account':
        return 'Enter Account Number';
      case 'customerName':
        return 'Enter Customer Name';
      case 'customerId':
        return 'Enter Customer ID';
      case 'cardNumber':
        return 'Enter Card Number';
      default:
        return 'Enter Value';
    }
  }

  getMinLengthForSelection(option: string): number {
    switch (option) {
      case 'account':
        return 16;
      case 'customerName':
        return 4;
      case 'customerId':
        return 6;
      case 'cardNumber':
        return 16;
      default:
        return 0;
    }
  }

  getMaxLengthForSelection(option: string): number {
    switch (option) {
      case 'account':
        return 16;
      case 'customerName':
        return 25;
      case 'customerId':
        return 6;
      case 'cardNumber':
        return 16;
      default:
        return 0;
    }
  }

  getPatternForSelection(option: string): string {
    return '^[0-9]*$';
  }


  getErrorMessage(inputModel: any, option: string): string {
    if (inputModel.errors?.required) {
      return `${this.getLabelForSelection(option)} is required`;
    }
    if (inputModel.errors?.minlength) {
      return `${this.getLabelForSelection(option)} must be at least ${this.getMinLengthForSelection(option)} digit long`;
    }
    if (inputModel.errors?.maxlength) {
      return `${this.getLabelForSelection(option)} cannot exceed ${this.getMaxLengthForSelection(option)} digit`;
    }

    if (inputModel.errors?.pattern) {
      return `${this.getLabelForSelection(option)} must contain only numbers`;
    }

    return '';
  }

  onSelectionChange(): void {
    this.userInput = '';
    this.data = [];
    this.showrecords = false;
    this.showCardDetails = false;
    this.dataSource = new MatTableDataSource(this.data);
  }

  retrieveData() {
    let postData: any = {
      accountNumber: this.selectedOption === 'account' ? this.userInput : null,
      customerName: this.selectedOption === 'customerName' ? this.userInput : null,
      customerId: this.selectedOption === 'customerId' ? this.userInput : null,
      cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
      "instid": this.institutionId,
      "servicetype": "CARDISSUANCE",
      "requesttype": "UPDATECUSTOMERDETAILS",
      "username": this.rest.readData('Username'),
    };

    this.spinner.show();
    //this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();

    const url = 'cbs/customerInfo';

    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.respCode === '00') {
          const cardData = res.Cbslist;

          if (cardData) {
            this.isEditMode = true;
            
            const matchedAcctSubType = this.acctSubTypeList.find(item => item.subAcctType === cardData.subAcctType);

            const matchedFee = this.data.find(item => item.schemeCode === cardData.schemeCode);

            // this.firstFormGroup = this._formBuilder.group({
            //   productcode: cardData.prdDesc || '',
            //   typeofCard: cardData.typeofcardDesc || '',
            //   branchCode: cardData.branchName || '',
            //   chnMask: cardData.chnMask || '',
            //   cardStatus: cardData.cardStatus || '',
            //   expDate: cardData.expDate ? this.parseDate1(cardData.expDate) : null,
            // });

            // this.secondFormGroup.patchValue({
            //   accountNo: cardData.accountNo || '',
            //   acctType: this.acctTypeList.find(item => item.accttype === cardData.accttype) || null,
            //   acctSubType: cardData.subAcctType || '',
            //   feeCode: cardData.schemeCode || '',
            //   currency: cardData.currencyCode || '',
            // });

            //this.getAccSubTypeList(cardData.accttype);
            //this.getFee(cardData.subAcctType, cardData.productCode);

            this.thirdFormGroup.patchValue({
              gender: cardData.sex || '',
              customerId: cardData.customerId || '',
              embossingName: cardData.embossingName || '',
              dateofBirth: cardData.birthdayDate ? this.parseDate(cardData.birthdayDate) : null,
              //dateofBirth: [cardData.birthdayDate ? this.parseDate2(cardData.birthdayDate) : null, pastDateValidator],
              spouseName: cardData.spouseName || '',
            });

            this.fourthFormGroup.patchValue({
              // addressline1: cardData.addressLine1 || '',
              // addressline2: cardData.addressLine2 || '',
              // city: cardData.city || '',
              // state: cardData.state || '',
              // pincode: cardData.pincode || '',
              // country: cardData.country || '',
              mailaddressline1: cardData.mailAddressLine1 || '',
              mailaddressline2: cardData.mailAddressLine2 || '',
              mailcity: cardData.mailCity || '',
              // mailstate: cardData.mailState || '',
              // mailpincode: cardData.mailPincode || '',
              mailcountry: cardData.mailCountry || '',
              mobNo: cardData.mobNo || '',
              emailId: cardData.emailId || '',
            });
          }
          this.customerData = cardData;
          this.showCardDetails = true;
        } else {
          this.showCardDetails = false;
          this.alerts.errorAlert('Update Customer Details', res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error('API Error:', error);
        this.alerts.errorAlert('Customer Details Fetch API Error', 'An error occurred while fetching customer details.');
      }
    );
  }

  parseDate(dateString: string): Date | null {
    if (!dateString || !/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return null;
    }

    const [month, day, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return isNaN(date.getTime()) ? null : date;
  }

  updateCustomerEntry() {
    this.spinner.show();
    let postData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      "cvv1": this.customerData.cvv1,
      "cvv2": this.customerData.cvv2,
      "processStatus": this.customerData.processStatus,
      "orgChn": this.customerData.orgChn,
      "serviceCode": this.customerData.serviceCode,
      "chnMask": this.customerData.chnMask,
      "regDate": this.customerData.regDate,
      "expDate": this.customerData.expDate,
      "result": this.customerData.result,
      "encryptChn": this.customerData.encryptChn,
      "lmtBasedOn": this.customerData.lmtBasedOn,
      "crdType": this.customerData.crdType,
      "pinOffset": this.customerData.pinOffset,
      "cafRecStatus": this.customerData.cafRecStatus,
      "authDate": this.customerData.authDate,
      "batchNo": this.customerData.batchNo,
      "appNumber": this.customerData.appNumber,
      "insFlag": this.customerData.insFlag,
      "cbd": this.customerData.cbd,
      "chn": this.customerData.chn,
      "crdTypeBank": this.customerData.crdTypeBank,
      "services": this.customerData.services,
      "icvv": this.customerData.icvv,
      "customerId": this.thirdFormGroup.value.customerId,
      "sex": this.thirdFormGroup.value.gender,
      //"encodingName": this.thirdFormGroup.value.encodingname,
      "encodingName": this.thirdFormGroup.value.embossingName.trim().toUpperCase(),
      "embossingName": this.thirdFormGroup.value.embossingName.trim().toUpperCase(),
      "birthdayDate": this.datePipe.transform(this.thirdFormGroup.value.dateofBirth, 'ddMMyyyy'),
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
    };

    let url = 'cardmaintain/update';
    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.alerts.successAlert("Update Customer Details", res.respDesc);
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.alerts.errorAlert("Update Customer Details", res.respDesc);
        }
      },
      (error) => {
        this.spinner.hide();
        console.error('API Error:', error);
        this.alerts.errorAlert('Error Adding Customer Entry', 'An error occurred while adding the customer entry.');
      }
    );
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

