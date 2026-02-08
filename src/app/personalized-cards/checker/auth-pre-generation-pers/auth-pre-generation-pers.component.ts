
import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-auth-pre-generation-pers',
  templateUrl: './auth-pre-generation-pers.component.html',
  styleUrls: ['./auth-pre-generation-pers.component.scss'],
  providers: [DatePipe]
})

export class AuthPreGenerationPersComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['productcode', 'branchcode', 'cardNo', 'expdate', 'accountNo', 'customerId', 'customername', 'cardtype'];
  dataSource = new MatTableDataSource();
  data = [];
  userData: any;
  columns: any = [];
  institutionId: any = "";
  sftplist: any;
  filtervalue: any;
  reqDatatofetch: any;
  showrecords: boolean = false;
  sftpvalue: any;
  profiletype: any;
  noncpckitprocode: any;
  filteredList2: any[] = [];
  branchObj: any = null;
  branchlist: any[] = [];
  productlist: any[] = [];
  filteredList1: any[] = [];
  productObj: any = null;
  fromDate: Date;
  toDate: Date;
  today: Date = new Date();

  constructor(public rest: RestService,
    private spinner: NgxSpinnerService,
    public alerts: NotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
  ) { }



  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.noncpckitprocode = this.rest.noncpckitprocesscode;
    this.getProductData();
    this.getBranchData();
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
          this.productlist = res.productList || [];
          this.filteredList1 = this.productlist.slice();
        } else {
          console.error('Error fetching product data:', res.respMessage);
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }


  getBranchData() {
    const reqData = {
      instId: this.institutionId,
    };

    const url = 'get/branch';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode === '00') {
        this.branchlist = res.branchList || [];
        this.filteredList2 = this.branchlist.slice();
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting branch details');
      }
    });
  }

  onFromDateChange(event: any): void {
    if (this.toDate && this.toDate < this.fromDate!) {
      this.toDate = null;
    }
  }


  isFilterValid(): boolean {
    if (this.filtervalue === 'all') return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'product' && this.productObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'branch' && this.branchObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'both' && this.productObj && this.branchObj) return !!this.fromDate && !!this.toDate;

    return false;
  }


  getFilterRecordList() {
    this.spinner.show();
    if (this.filtervalue === "all") {
      this.reqDatatofetch = {
        "instId": this.institutionId,
        "branch": "all",
        "product": "all",
        "searchType": "ALL",
        "processStatus": this.rest.noncpckitprocode,
        "reqType": "nonCpcType",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "product") {
      this.reqDatatofetch = {
        "instId": this.institutionId,
        "branch": "all",
        "product": this.productObj.productCode,
        "searchType": "P",
        "processStatus": this.rest.noncpckitprocode,
        "reqType": "nonCpcType",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "branch") {
      this.reqDatatofetch = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": "all",
        "searchType": "B",
        "processStatus": this.rest.noncpckitprocode,
        "reqType": "nonCpcType",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "both") {
      this.reqDatatofetch = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": this.productObj.productCode,
        "searchType": "BP",
        "processStatus": this.rest.noncpckitprocode,
        "reqType": "nonCpcType",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    }

    let url = 'encoding/authprelist';
    this.rest.postValidate(this.reqDatatofetch, url).subscribe((res: any) => {

      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.data = res.authList;
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert('Generate Pre-file', res.respDesc);
      }
    })
  }


  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rejectpre() {

    this.spinner.show();
    // const profilename = this.sftpvalue.split('_');
    const reqData = {
      "instId": this.institutionId,
      "preType": this.profiletype,
      "username": this.rest.readData('Username'),
      // "sftpName": profilename[1],
      "cardDetails": this.data
    }

    let url = 'encoding/pre/reject';

    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.successAlert('Generate Pre-file', res.respDesc);
        this.showrecords = false;
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert('Generate Pre-file', res.respDesc);
      }
    })
  }

  generateprefile() {

    this.spinner.show();
    // const profilename = this.sftpvalue.split('_');
    const reqData = {
      "instId": this.institutionId,
      "preType": this.profiletype,
      "username": this.rest.readData('Username'),
      // "sftpName": profilename[1],
      "cardDetails": this.data
    }

    let url = 'encoding/preauth';

    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.successAlert('Generate Pre-file', res.respDesc);
        this.showrecords = false;
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert('Generate Pre-file', res.respDesc);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  cancelprefile() {
    this.showrecords = false;
  }

  clearfilter() {
    this.productObj = "";
    this.branchObj = "";
  }

}

