// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { NotificationService } from 'app/services/notification.service';
// import { Router } from '@angular/router';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { RestService } from 'app/services/rest.service';
// import { NgxSpinnerService } from "ngx-spinner";
// import { FormBuilder } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { MatSort } from '@angular/material/sort';

// export interface PeriodicElement {
//   chnMask: string;
//   customerId: string;
//   primaryAccountnumber: string;
//   customerName: string;
//   mobNo: string;
// }

// @Component({
//   selector: 'app-individual-card-limit',
//   templateUrl: './individual-card-limit.component.html',
//   styleUrls: ['./individual-card-limit.component.scss'],
//   providers: [DatePipe]
// })

// export class IndividualCardLimitComponent implements OnInit {
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort) sort: MatSort;

//   dataSource = new MatTableDataSource<PeriodicElement>();
//   institutionId: any;
//   userData: any;
//   cardTypeFromGroup: FormGroup;
//   mode = 'E';
//   today: Date = new Date();
//   userInput: string = '';
//   showrecords: boolean = false;
//   limit: any;
//   selectedOption: string = '';

//   displayedColumns: string[] = ['chnMask', 'customerId', 'primaryAccountnumber', 'customerName', 'mobNo'];

//   constructor(
//     public rest: RestService,
//     public alerts: NotificationService,
//     private spinner: NgxSpinnerService,
//     private datePipe: DatePipe,
//     private fb: FormBuilder,
//     private router: Router) {
//   }

//   ngOnInit(): void {
//     this.institutionId = this.rest.readData('InstituteId');
//     this.userData = this.rest.readData('Username');
//     this.InitForm();
//   }

//   InitForm() {
//     this.cardTypeFromGroup = this.fb.group({
//       fromDate: new FormControl('', Validators.required),
//       toDate: new FormControl('', Validators.required),
//       cumMaxWdlAmt: new FormControl('', [
//         Validators.required,
//         Validators.maxLength(7),
//         Validators.pattern('^[0-9]*$')
//       ]),
//       cumMaxWdlCnt: new FormControl('', [
//         Validators.required,
//         Validators.maxLength(2),
//         Validators.pattern('^[0-9]*$')
//       ])
//     });
//   }

//   reloadCurrentRoute() {
//     let currentUrl = this.router.url;
//     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//       this.router.navigate([currentUrl]);
//     });
//   }

//   onSelectionChange(): void {
//     this.userInput = '';
//     this.limit = [];
//     this.showrecords = false;
//     this.dataSource = new MatTableDataSource(this.limit);
//   }

//   getLabelForSelection(option: string): string {
//     switch (option) {
//       case 'customerId':
//         return 'Enter the Customer ID';
//       case 'cardNumber':
//         return 'Enter the Card Number';
//       default:
//         return 'Enter Value';
//     }
//   }

//   getPlaceholderForSelection(option: string): string {
//     switch (option) {
//       case 'customerId':
//         return 'Enter Customer ID';
//       case 'cardNumber':
//         return 'Enter Card Number';
//       default:
//         return 'Enter Value';
//     }
//   }

//   getMinLengthForSelection(option: string): number {
//     switch (option) {
//       case 'customerId':
//         return 6;
//       case 'cardNumber':
//         return 16;
//       default:
//         return 0;
//     }
//   }

//   getMaxLengthForSelection(option: string): number {
//     switch (option) {
//       case 'customerId':
//         return 6;
//       case 'cardNumber':
//         return 16;
//       default:
//         return 0;
//     }
//   }

//   getPatternForSelection(option: string): string {
//     return '^[0-9]*$';
//   }

//   getErrorMessage(inputModel: any, option: string): string {
//     if (inputModel.errors?.required) {
//       return `${this.getLabelForSelection(option)} is required`;
//     }
//     if (inputModel.errors?.minlength) {
//       return `${this.getLabelForSelection(option)} must be at least ${this.getMinLengthForSelection(option)} digit long`;
//     }
//     if (inputModel.errors?.maxlength) {
//       return `${this.getLabelForSelection(option)} cannot exceed ${this.getMaxLengthForSelection(option)} digit`;
//     }
//     if (inputModel.errors?.pattern) {
//       return `${this.getLabelForSelection(option)} must contain only numbers`;
//     }
//     return '';
//   }

//   retrieveData(): void {
//     this.spinner.show();

//     const reqData = {
//       customerId: this.selectedOption === 'customerId' ? this.userInput : null,
//       cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
//       instId: this.institutionId,
//     };

//     this.rest.postValidate(reqData, 'limit/get').subscribe((res: any) => {
//       this.spinner.hide();
//       if (res.respCode === '00') {
//         this.limit = res.LimitResponse;
//         this.initTables(this.limit);
//         this.showrecords = true;
//         const limits = this.limit[0].txnLimits;

//         this.cardTypeFromGroup.patchValue({
//           ...limits
//         });
//       } else {
//         this.alerts.errorAlert("Individual Card Limit", res.respDesc);
//       }
//     });
//   }

//   cancelcvvgenerate() {
//     this.limit = '';
//     this.showrecords = false;
//   }

//   initTables(limit: any) {
//     this.dataSource = new MatTableDataSource(limit);
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   generatecvv(): void {
//     this.spinner.show();

//     const rawFormValues = this.cardTypeFromGroup.getRawValue();
//     const fromDateRaw = rawFormValues.fromDate;
//     const toDateRaw = rawFormValues.toDate;

//     const formattedFromDate = fromDateRaw
//       ? this.datePipe.transform(fromDateRaw, 'dd-MM-yyyy')
//       : null;
//     const formattedToDate = toDateRaw
//       ? this.datePipe.transform(toDateRaw, 'dd-MM-yyyy')
//       : null;

//     let selectedCard = this.limit[0];

//     const postData = {
//       instId: this.institutionId,
//       username: this.userData,
//       chnMask: selectedCard.chnMask,
//       chn: selectedCard.chn,
//       customerId: selectedCard.customerId,
//       primaryAccountnumber: selectedCard.primaryAccountnumber,
//       customerName: selectedCard.customerName,
//       encryptChn: selectedCard.encryptChn,
//       ...rawFormValues,
//       fromDate: formattedFromDate,
//       toDate: formattedToDate,
//     };

//     this.rest.postValidate(postData, 'limit/add').subscribe((res: any) => {
//       this.spinner.hide();
//       if (res.respCode === '00') {
//         this.cardTypeFromGroup.reset();
//         this.alerts.successAlert('Individual Card Limit', res.respDesc);
//         setTimeout(() => {
//           this.reloadCurrentRoute();
//         }, 3000)
//       } else {
//         this.alerts.errorAlert('Individual Card Limit', res.respDesc);
//       }
//     });
//   }
// }




import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'app/services/rest.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  chnMask: string;
  customerId: string;
  primaryAccountnumber: string;
  customerName: string;
  mobNo: string;
}

@Component({
  selector: 'app-individual-card-limit',
  templateUrl: './individual-card-limit.component.html',
  styleUrls: ['./individual-card-limit.component.scss'],
  providers: [DatePipe]
})
export class IndividualCardLimitComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<PeriodicElement>();
  institutionId: any;
  userData: any;
  cardTypeFromGroup: FormGroup;
  mode = 'E';
  today: Date = new Date();
  userInput: string = '';
  showrecords: boolean = false;
  limit: any;
  selectedOption: string = '';

  displayedColumns: string[] = ['chnMask', 'customerId', 'primaryAccountnumber', 'customerName', 'mobNo'];

  constructor(
    public rest: RestService,
    public alerts: NotificationService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.InitForm();
  }

  InitForm() {
    this.cardTypeFromGroup = this.fb.group({
      fromDate: new FormControl('', [
        Validators.required,
        this.validateDate.bind(this)
      ]),
      toDate: new FormControl('', [
        Validators.required,
        this.validateDate.bind(this),
        this.validateToDate.bind(this)
      ]),
      cumMaxWdlAmt: new FormControl('', [
        Validators.required,
        Validators.maxLength(7),
        Validators.pattern('^[0-9]*$'),
        Validators.min(0),
        Validators.max(9999999)
      ]),
      cumMaxWdlCnt: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern('^[0-9]*$'),
        Validators.min(0),
        Validators.max(99)
      ])
    });

    // Add cross-field validation for date range
    this.cardTypeFromGroup.get('fromDate').valueChanges.subscribe(() => {
      this.cardTypeFromGroup.get('toDate').updateValueAndValidity();
    });
  }

  validateDate(control: FormControl): { [key: string]: any } | null {
    if (!control.value) {
      return { required: true };
    }
    return null;
  }

  validateToDate(control: FormControl): { [key: string]: any } | null {
    if (!this.cardTypeFromGroup) return null;
    
    const fromDate = this.cardTypeFromGroup.get('fromDate').value;
    const toDate = control.value;
    
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      return { invalidDateRange: true };
    }
    return null;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onSelectionChange(): void {
    this.userInput = '';
    this.limit = [];
    this.showrecords = false;
    this.dataSource = new MatTableDataSource(this.limit);
  }

  getLabelForSelection(option: string): string {
    switch (option) {
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

  retrieveData(): void {
    this.spinner.show();

    const reqData = {
      customerId: this.selectedOption === 'customerId' ? this.userInput : null,
      cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
      instId: this.institutionId,
    };

    this.rest.postValidate(reqData, 'limit/get').subscribe((res: any) => {
      this.spinner.hide();
      if (res.respCode === '00') {
        this.limit = res.LimitResponse;
        this.initTables(this.limit);
        this.showrecords = true;
        
        const limits = this.limit[0].txnLimits || {};
        
        // Validate and format dates from response
        const fromDate = limits.fromDate ? this.parseDateString(limits.fromDate) : null;
        const toDate = limits.toDate ? this.parseDateString(limits.toDate) : null;
        
        // Validate numeric values
        const cumMaxWdlAmt = this.validateNumber(limits.cumMaxWdlAmt, 0, 9999999);
        const cumMaxWdlCnt = this.validateNumber(limits.cumMaxWdlCnt, 0, 99);
        
        this.cardTypeFromGroup.patchValue({
          fromDate: fromDate,
          toDate: toDate,
          cumMaxWdlAmt: cumMaxWdlAmt,
          cumMaxWdlCnt: cumMaxWdlCnt
        });
        
        // Mark all fields as touched to show errors if any
        //this.markFormGroupTouched(this.cardTypeFromGroup);
      } else {
        this.alerts.errorAlert("Individual Card Limit", res.respDesc);
      }
    });
  }

  private parseDateString(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    const formats = ['dd-MM-yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy'];
    for (const format of formats) {
      const parsed = this.datePipe.transform(dateStr, format);
      if (parsed) {
        return new Date(parsed);
      }
    }
    return null;
  }

  private validateNumber(value: any, min: number, max: number): number | null {
    if (value === null || value === undefined) return null;
    
    const num = Number(value);
    if (isNaN(num)) return null;
    
    return Math.max(min, Math.min(max, num));
  }

  cancelcvvgenerate() {
    this.limit = '';
    this.showrecords = false;
  }

  initTables(limit: any) {
    this.dataSource = new MatTableDataSource(limit);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  generatecvv(): void {
    if (this.cardTypeFromGroup.invalid) {
      this.alerts.errorAlert('Validation Error', 'Please correct all validation errors before submitting');
      this.markFormGroupTouched(this.cardTypeFromGroup);
      return;
    }

    this.spinner.show();

    const rawFormValues = this.cardTypeFromGroup.getRawValue();
    
    if (new Date(rawFormValues.toDate) < new Date(rawFormValues.fromDate)) {
      this.spinner.hide();
      this.alerts.errorAlert('Validation Error', 'To Date must be after From Date');
      return;
    }

    const formattedFromDate = rawFormValues.fromDate
      ? this.datePipe.transform(rawFormValues.fromDate, 'dd-MM-yyyy')
      : null;
    const formattedToDate = rawFormValues.toDate
      ? this.datePipe.transform(rawFormValues.toDate, 'dd-MM-yyyy')
      : null;

    let selectedCard = this.limit[0];

    const postData = {
      instId: this.institutionId,
      username: this.userData,
      chnMask: selectedCard.chnMask,
      chn: selectedCard.chn,
      customerId: selectedCard.customerId,
      primaryAccountnumber: selectedCard.primaryAccountnumber,
      customerName: selectedCard.customerName,
      encryptChn: selectedCard.encryptChn,
      ...rawFormValues,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    };

    this.rest.postValidate(postData, 'limit/add').subscribe((res: any) => {
      this.spinner.hide();
      if (res.respCode === '00') {
        this.cardTypeFromGroup.reset();
        this.alerts.successAlert('Individual Card Limit', res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.alerts.errorAlert('Individual Card Limit', res.respDesc);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}