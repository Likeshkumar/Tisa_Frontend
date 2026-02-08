import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss'],
  providers: [DatePipe]
})

export class CardOrderComponent implements OnInit {
  productlist: any = [];
  branchlist: any = [];
  productObj: any;
  branchObj: any;
  subtype: any;
  institutionId: any;
  subtypelist: any = [];
  cardtypeList: any = [];
  services: any;
  cardtype: any;
  noofcards: any;
  userData: any;
  data: any;
  pinMethod: any;
  filteredList1: any;
  filteredList2: any;

  cardOrderForm: FormGroup = new FormGroup(
    {
      productcode: new FormControl('', [Validators.required]),
      branchcode: new FormControl('', [Validators.required]),
      limitBaseOn: new FormControl('CT', [Validators.required]),
      typeofCard: new FormControl('', [Validators.required]),
      pinMethod: new FormControl('', [Validators.required]),
      noofcards: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.maxLength(4)])
    }
  );

  constructor(
    private router: Router,
    public alerts: NotificationService,
    private spinner: NgxSpinnerService,
    public rest: RestService,
    public datepipe: DatePipe) {

  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.productlist = this.getProductData();
    this.branchlist = this.getBranchData();
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


  registerInstantCard() {
    this.spinner.show();

    const reqData = {
      instId: this.institutionId,
      userName: this. userData,
      productCode: this.cardOrderForm.value.productcode.productCode,
      branchCode: this.cardOrderForm.value.branchcode.branchCode,
      typeOfCard: this.cardOrderForm.value.typeofCard.typeofCard,
      numberOfCards: this.cardOrderForm.value.noofcards,
      pinMethod: this.cardOrderForm.value.pinMethod
    };

    this.rest.postValidate(reqData, 'instant/card/process').subscribe({
      next: (res: any) => {
        this.spinner.hide();

        switch (res?.respCode) {
          case '00':
            this.alerts.successAlert('Instant Card Order', res.respDesc);
            if (res.cardtypeList?.length > 0) {
            }
            setTimeout(() => this.reloadCurrentRoute(), 3000);
            break;

          case '01':
            this.alerts.errorAlert('Instant Card Order', res.respDesc || 'Exception while generating the card.');
            break;

          case '02':
            this.alerts.errorAlert('Instant Card Order', res.respDesc || 'Authorization failed.');
            break;

          default:
            this.alerts.errorAlert('Instant Card Order', res.respDesc || 'Unknown error occurred.');
        }
      },
      error: (error: any) => {
        this.spinner.hide();

        const status = error?.status ?? 'Unknown';
        const message = error?.message ?? 'Unexpected error occurred.';

        if (status === 401) {
          this.alerts.errorAlert('Instant Card Order ', 'Your session has expired. Please log in again.');
        } else if (status === 205) {
          this.alerts.errorAlert('Instant Card Order ', 'Please refresh and try again.');
        } else if (status === 500) {
          this.alerts.errorAlert('Instant Card Order ', 'Internal Server Error. Try again later.');
        } else {
          this.alerts.errorAlert('Instant Card Order - Network Error', `Error ${status}: ${message}`);
        }

        console.error(`HTTP Error [${status}]:`, error);
      }
    });
  }

  clear() {
    this.cardOrderForm.reset();
  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

