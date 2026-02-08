

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manual-update',
  templateUrl: './manual-update.component.html',
  styleUrls: ['./manual-update.component.scss'],
  providers: [DatePipe]
})


export class ManualUpdateComponent implements OnInit {

  dataSource = new MatTableDataSource<PeriodicElement>();
  userFormGroup: FormGroup;
  cardNumber: any;
  showCardDetails: boolean = false;
  showcardDetails: boolean = false;
  radiobuttonvalue: any = 'cardNumber';
  customerData: any;
  changeStatus: any;
  changeStat: any;
  institutionId: string;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  showrecords: boolean = false;
  selectedOption: string = '';
  userInput: string = '';
  acctTypeList: any = [];
  currencylist = [];
  selectedItem: any;
  isLinear = true;
  cardNo: any;
  productlist: any;
  branchList: any;
  acctSub: any;
  productObj: any;
  branchObj: any;
  subtype: any;
  acctType: any;

  subtypelist: any;
  data: any;
  limitName: string = "";
  feeName: String = "";
  services: any;
  regDate: any;
  acctSubTypelist = [];

  appDate: any;
  applicationNo: any;
  cardtype: any;
  expDate: any;
  noofcards: any;
  myDate: any;
  cardtypeList: any;
  accountData: any = [];
  accountProductlist: any;
  accountproductvalue: any;
  acctsubtype: any;
  subtypeList: any;
  servicelist: any;
  isEditMode = false;
  cardCollectBranchList: any = [];
  acctSubTypeList: any = [];

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
    this.getBranchData();
    this.formInt();
    this.getAccType();
    this.getCurrency();
  }

  getProductData() {
    const postdata = {
      "instId": this.institutionId,
    };

    const url = 'get/product';
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

  getAccSubTypeList(acctType: string) {
    const reqData = {
      instId: this.institutionId,
      acctType: acctType
    };
    this.rest.postValidate(reqData, 'get/acctSubType').subscribe((res: any) => {
      if (res.respCode === '00') {
        this.acctSubTypeList = res.accountsubType;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Account Sub Type Details');
      }
    });
  }

  onAcctSubTypeChange() {
    const selectedAcctSubType = this.secondFormGroup.get('acctSubType')?.value;
    const productCode = this.firstFormGroup.get('productcode')?.value; // Get product code from the first form group

    if (selectedAcctSubType && productCode) {
      this.getFee(selectedAcctSubType, productCode);
    } else {
      console.error('Account Sub Type or Product Code is missing');
    }
  }

  getFee(acctSubType: string, productCode: string) {
    if (!productCode || !acctSubType) {
      console.error('Missing Product Code or Account Sub Type');
      return;
    }

    const reqData = {
      instId: this.institutionId,
      productCode: productCode,
      acctSubType: acctSubType,
    };

    this.rest.postValidate(reqData, 'get/fee/get').subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.data = res.FeeList;
        } else {
          this.data = [];
          console.error('Error fetching Fee List:', res.respDesc);
        }
      },
      (error) => {
        console.error('Error in fee request:', error);
        this.data = [];
      }
    );
  }


  formInt() {
    // this.firstFormGroup = this._formBuilder.group({
    //   productcode: ['', Validators.required],
    //   typeofCard: ['', [Validators.required]],
    //   branchCode: ['', Validators.required],
    //   chnMask: ['', Validators.required],
    //   cardStatus: ['', Validators.required],
    //   expDate: ['', Validators.required],
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   accountNo: ['', [Validators.required, Validators.pattern("^[0-9]{16}$")]],
    //   acctType: ['', Validators.required],
    //   acctSubType: ['', Validators.required],
    //   feeCode: ['', Validators.required],
    //   currency: ['', Validators.required],
    // });
    this.thirdFormGroup = this._formBuilder.group({
      gender: ['', Validators.required],
      customerId: ['', Validators.required],
      encodingname: ['', [Validators.required, Validators.maxLength(24), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
      dateofBirth: ['', [this.pastDateValidator()]],
      spouseName: [''],
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
      mailcity: [''],
      // mailstate: [''],
      // mailpincode: [''],
      mailcountry: [''],
      mobNo: ['', [Validators.required, Validators.pattern("^[0-9]{9}$")]],
      emailId: ['', [Validators.maxLength(50), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })

  }

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


  // retrieveData() {
  //   let postData: any = {
  //     accountNumber: this.selectedOption === 'account' ? this.userInput : null,
  //     customerName: this.selectedOption === 'customerName' ? this.userInput : null,
  //     customerId: this.selectedOption === 'customerId' ? this.userInput : null,
  //     cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
  //     instId: this.institutionId,
  //   };

  //   this.spinner.show();
  //   this.secondFormGroup.reset();
  //   this.thirdFormGroup.reset();
  //   this.fourthFormGroup.reset();

  //   let url = 'cardmaintain/customerdetails';


  //   this.rest.postValidate(postData, url).subscribe(
  //     (res: any) => {
  //       this.spinner.hide();

  //       if (res.respCode === '00') {
  //         const cardData = res.customerDetailsList;

  //         if (cardData) {
  //           this.isEditMode = true;

  //           const matchedAcctSubType = this.acctSubTypeList.find(item => item.subAcctType === cardData.subAcctType);

  //           const matchedFee = this.data.find(item => item.schemeCode === cardData.schemeCode);

  //           this.firstFormGroup = this._formBuilder.group({
  //             productcode: cardData.prdDesc || '',
  //             typeofCard: cardData.typeofcardDesc || '',
  //             branchCode: cardData.branchName || '',
  //             chnMask: cardData.chnMask || '',
  //             cardStatus: cardData.cardStatus || '',
  //             expDate: cardData.expDate ? this.parseDate1(cardData.expDate) : null
  //           });

  //           this.secondFormGroup.patchValue({
  //             accountNo: cardData.accountNo || '',
  //             acctType: this.acctTypeList.find(item => item.accttype === cardData.accttype) || null,
  //             acctSubType: cardData.subAcctType || '',
  //             feeCode: cardData.schemeCode || '',
  //             currency: cardData.currencyCode || '',
  //           });

  //           this.getAccSubTypeList(cardData.accttype);
  //           this.getFee(cardData.subAcctType, cardData.productCode);

  //           this.thirdFormGroup.patchValue({
  //             gender: cardData.sex || '',
  //             customerId: cardData.customerId || '',
  //             encodingname: cardData.encodingName || '',
  //             dateofBirth: cardData.birthdayDate ? this.parseDate(cardData.birthdayDate) : null,
  //             spouseName: cardData.spouseName || ''
  //           });

  //           this.fourthFormGroup.patchValue({
  //             addressline1: cardData.addressLine1 || '',
  //             addressline2: cardData.addressLine2 || '',
  //             city: cardData.city || '',
  //             state: cardData.state || '',
  //             pincode: cardData.pincode || '',
  //             country: cardData.country || '',
  //             mailaddressline1: cardData.mailAddressLine1 || '',
  //             mailaddressline2: cardData.mailAddressLine2 || '',
  //             mailcity: cardData.mailCity || '',
  //             mailstate: cardData.mailState || '',
  //             mailpincode: cardData.mailPincode || '',
  //             mailcountry: cardData.mailCountry || '',
  //             mobNo: cardData.mobNo || '',
  //             emailId: cardData.emailId || ''
  //           });
  //         }
  //         this.customerData = cardData;
  //         this.showCardDetails = true;
  //       } else {
  //         this.showCardDetails = false;
  //         this.alerts.errorAlert("Update Customer Details", res.respDesc);
  //       }

  //     },
  //     (error) => {
  //       this.spinner.hide();
  //       console.error('API Error:', error);
  //       this.alerts.errorAlert('An error occurred while fetching customer details.', 'Customer Details Fetch API Error');
  //     }
  //   );

  // }


  retrieveData() {
    let postData: any = {
      accountNumber: this.selectedOption === 'account' ? this.userInput : null,
      customerName: this.selectedOption === 'customerName' ? this.userInput : null,
      customerId: this.selectedOption === 'customerId' ? this.userInput : null,
      cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
      instId: this.institutionId,
    };

    this.spinner.show();
    //this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();

    const url = 'cardmaintain/customerdetails';

    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.respCode === '00') {
          const cardData = res.customerDetailsList[0];

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
              encodingname: cardData.encodingName || '',
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

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const date = control.value;
      if (date && date > new Date()) {
        return { invalidDate: true };
      }
      return null;
    };
  }


  parseDate1(dateString: string): string | null {
    if (!dateString || dateString.length !== 6) {
      return null;
    }

    const year = dateString.substring(0, 4); // Extract YYYY
    const month = dateString.substring(4, 6); // Extract MM

    return `${month}/${year}`; // Return as MM/YYYY format
  }

  parseDate2(dateStr: string): Date | null {
    if (dateStr) {
      const parts = dateStr.split('-'); // Split the date by '-'
      // parts[0] = day, parts[1] = month, parts[2] = year
      return new Date(+parts[2], +parts[1] - 1, +parts[0]); // Month is 0-based
    }
    return null;
  }


  onSelectionChange(): void {
    this.userInput = '';
    this.data = [];
    this.showrecords = false;
    this.showCardDetails = false;
    this.dataSource = new MatTableDataSource(this.data);
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
      "chn": this.customerData.chn,
      "crdTypeBank": this.customerData.crdTypeBank,
      "services": this.customerData.services,
      "icvv": this.customerData.icvv,
      "userName": this.customerData.userName,
      "instId": this.customerData.instId,
      "prodCode": this.customerData.prodCode,
      "encDate": this.customerData.encDate,
      "PBranchCode": this.customerData.PBranchCode,
      "rnfCardStatus": this.customerData.rnfCardStatus,
      "issDate": this.customerData.issDate,
      "crdStatus": this.customerData.crdStatus,
      "subProduct": '15',
      "limitBaseOn": 'CT',
      //"cardCollectBranch": this.secondFormGroup.value.cardCollectBranch?.cardCollectBranch,
      //"accountType": this.secondFormGroup.value.acctType?.acctdesc,
      //"accountNo": this.secondFormGroup.value.accountNo,
      //"accountSubType": this.secondFormGroup.value.acctSubType,
      //"currency": this.secondFormGroup.value.currency,
      "sex": this.thirdFormGroup.value.gender,
      //"encodingName": this.thirdFormGroup.value.encodingname,
      "encodingName": this.thirdFormGroup.value.encodingname.trim().toUpperCase(),
      "embossingName": this.thirdFormGroup.value.embossingname,
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

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export function gmailValidator() {
  return (control) => {
    const email = control.value;
    if (email && !email.endsWith('@gmail.com')) {
      return { 'gmailDomain': true };
    }
    return null;
  };

}

const pastDateValidator: ValidatorFn = (control: AbstractControl) =>
  new Date(control.value) >= new Date() ? { 'invalidDate': true } : null;

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
}
