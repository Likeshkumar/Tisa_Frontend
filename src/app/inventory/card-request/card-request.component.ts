
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-card-request',
  templateUrl: './card-request.component.html',
  styleUrls: ['./card-request.component.scss'],
  providers: [DatePipe]
})

export class CardRequestComponent implements OnInit {

  productlist: any = [];
  branchList: any = [];
  cardtypeList: any = [];
  chnList: any = [];
  institutionId: any;
  userData: any;
  today: Date = new Date();
  data: any;
  bankRequest: FormGroup;
  submitted = false;
  productObj: any;
  isBranchDropdownDisabled: boolean = false;
  branchlist: any[] = [];
  branchcode: any = null;
  filteredList2: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    public alerts: NotificationService,
    public rest: RestService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef
  ) { }

  // ngOnInit(): void {
  //   this.institutionId = this.rest.readData('InstituteId');
  //   this.userData = this.rest.readData('Username');
  //   this.getProductData();
  //   this.getBranchData();
  //   this.initializeForm();
  // }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getProductData();
    this.getBranchData();
    this.initializeForm();
    const savedBranchCode = this.rest.readData('branchCode');
    if (savedBranchCode && savedBranchCode !== 'null' && savedBranchCode !== '') {
      this.isBranchDropdownDisabled = true;

      setTimeout(() => {
        this.branchcode = this.branchlist.find(b => b.branchCode === savedBranchCode);
      }, 300);
    } else {
      this.isBranchDropdownDisabled = false;
    }
  }

  gettypeofCard() {
    const reqData = {
      "instId": this.institutionId,
      "productCode": this.productObj.productCode
    }
    let url = 'get/cardType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.cardtypeList = res.cardtypeList;
      } else {
        this.alerts.errorAlert(res.respDesc, 'SFTPList Details');
      }
    })

  }




  initializeForm() {
    this.bankRequest = this._formBuilder.group({
      chnCount: ['', [Validators.required, Validators.pattern("^[0-9]{1,3}$")]],
      typeofCard: ['', Validators.required],
      branchcode: ['', Validators.required],
      productcode: ['', Validators.required],
      deadLine: ['', [Validators.required, this.noPastOrTodayDateValidator()]],
      remarks: ['', [Validators.required, Validators.maxLength(60), Validators.pattern("^(?!\\s*$)[a-zA-Z ]+$")]],
      seveity: ['', Validators.required]
    });
  }

  atLeastOneFieldRequired(formGroup: FormGroup): ValidationErrors | null {
    const branchcode = formGroup.get('branchcode')?.value;
    const zonal = formGroup.get('zonal')?.value;

    if ((branchcode && zonal) || (!branchcode && !zonal)) {
      return { atLeastOneRequired: true };
    }
    return null;
  }

  // gettypeofCard() {
  //   const productObj = this.bankRequest.get('productObj')?.value;
  //   if (!productObj || !productObj.productCode) {
  //     console.warn("No product selected");
  //     return;
  //   }

  //   const reqData = {
  //     instId: this.institutionId,
  //     productCode: productObj.productCode
  //   };

  //   this.rest.postValidate(reqData, 'get/cardType').subscribe(
  //     (res: any) => {
  //       if (res.respCode === '00') {
  //         this.cardtypeList = res.cardtypeList || [];
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching card type:', error);
  //     }
  //   );
  // }

  getProductData() {
    const postdata = { instId: this.institutionId };
    this.rest.postValidate(postdata, 'get/product').subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.productlist = res.productList || [];
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

  // getBranchData() {
  //   const reqData = { instId: this.institutionId };
  //   this.rest.postValidate(reqData, 'get/branch').subscribe(
  //     (res: any) => {
  //       if (res.respCode === '00') {
  //         this.branchList = res.branchList || [];
  //       }
  //     }
  //   );
  // }

  getBranchData() {
    const reqData = {
      instId: this.institutionId,
    };

    const url = 'get/branch';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.branchlist = res.branchList || [];
        this.filteredList2 = this.branchlist.slice();

        const savedBranchCode = this.rest.readData('branchCode');

        // Check if user is branch-based
        if (savedBranchCode && savedBranchCode !== 'null' && savedBranchCode !== '') {
          this.isBranchDropdownDisabled = true;

          // Find the branch in the loaded list
          const selectedBranch = this.branchlist.find(b => b.branchCode === savedBranchCode);

          if (selectedBranch) {
            // Set the form control value directly
            this.bankRequest.get('branchcode').setValue(selectedBranch);
            this.bankRequest.get('branchcode').updateValueAndValidity();
          }
        } else {
          this.isBranchDropdownDisabled = false;
          // Optionally set a default value or leave empty
        }
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting branch details');
      }
    });
  }

  bankRequestSubmit() {
    this.spinner.show();

    let postData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      chnCount: this.bankRequest.value.chnCount,
      productcode: this.bankRequest.value.productcode.productCode,
      branchcode: this.bankRequest.value.branchcode.branchCode,
      typeOfCard: this.bankRequest.value.typeofCard.typeofCard,
      deadLine: this.datePipe.transform(this.bankRequest.value.deadLine, 'dd-MM-yyyy'),
      remarks: this.bankRequest.value.remarks,
      seveity: this.bankRequest.value.seveity,

    }

    let url = 'stock/add';
    this.rest.postValidate(postData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.data = (res.authList);
        this.alerts.successAlert("Card Request", res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.spinner.hide();
        this.alerts.errorAlert("Card Request", res.respDesc);

      }
    })
  }

  clear() {
    this.bankRequest.reset();
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  noPastOrTodayDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }

      const currentDate = new Date();
      const inputDate = new Date(control.value);

      // Reset time to midnight for accurate date-only comparison
      currentDate.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      // If input date is today or in the past, it's invalid
      return inputDate <= currentDate ? { 'invalidDate': true } : null;
    };
  }


}



