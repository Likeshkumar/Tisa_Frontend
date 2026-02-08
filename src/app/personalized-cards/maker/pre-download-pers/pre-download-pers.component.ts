

import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PeriodicElement {
  productcode: string;
  branchcode: string;
  cardNo: string;
  expdate: string;
  accountNo: string;
  customerId: string;
  customername: string;
  cardtype: string;

}

@Component({
  selector: 'app-pre-download-pers',
  templateUrl: './pre-download-pers.component.html',
  styleUrls: ['./pre-download-pers.component.scss']
})

export class PreDownloadPersComponent implements OnInit {
  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['productcode', 'branchcode', 'cardNo', 'accountNo', 'mobileNumber', 'customerId', 'customername'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  columns: any = [];
  institutionId: string;
  batchlist: any;
  batchnum: any;
  showrecords: boolean = false;
  total$: any;
  productlist: any;
  branchList: any;
  productObj: any;
  branchObj: any;
  preForm: FormGroup;
  userData: any;
  cardtypeList: any;

  constructor(
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public alerts: NotificationService,
    private cdr: ChangeDetectorRef,
  ) { this.dataSource.paginator = this.paginator; }



  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    if (this.institutionId) {
      this.getProductData();
      this.getBranchData();
      this.formInt();
    }
  }

  formInt() {
    this.preForm = this._formBuilder.group({
      productcode: ['', Validators.required],
      typeofCard: ['', Validators.required],
      preFileFormate: ['', Validators.required]
    });
  }

  // getProductData() {

  //   const postdata = {
  //     "instId": this.institutionId,
  //   };

  //   const url = 'get/product';
  //   this.rest.postValidate(postdata, url).subscribe(
  //     (res: any) => {
  //       if (res.respCode === '00') {
  //         this.productlist = res.productList;
  //       }
  //     }
  //   );
  // }

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
    };
    const url = 'get/cardType';

    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.cardtypeList = res.cardtypeList;
        this.preForm.patchValue({ preFileFormate: '' });
        this.batchlist = [];
        this.batchnum = null;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Card type Details');
      }
    });
  }

  getbatchlist() {
    this.spinner.show();
    const reqData = {
      "instId": this.institutionId,
      "productCode": this.productObj?.productCode,
      "typeofCard": this.preForm.value.typeofCard.typeofCard,
      "preFileFormat": this.preForm.value.preFileFormate
    }
    let url = 'get/batchlist';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.batchlist = res.batchList;
      } else {
        this.spinner.hide();
        this.alerts.showError(res.respDesc, 'Batch List Details');

      }
    })

  }

  onCardTypeChange() {
    this.preForm.patchValue({ preFileFormate: '' });
    this.batchlist = [];
    this.batchnum = null;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  downloadPre() {

    this.spinner.show();
    let reqDataauthorise = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      "batchNo": this.batchnum,
      // "cardDetails": this.data
    }

    let url = 'encoding/pre/download';
    this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.successAlert('Pre FIle Download', res.respDesc);
        this.showrecords = false;
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert('Pre FIle Download', res.respDesc);
      }
    })
  }

}

