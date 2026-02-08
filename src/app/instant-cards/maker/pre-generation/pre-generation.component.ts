import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { generate } from 'rxjs';
import { DatePipe } from '@angular/common';



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
  selector: 'app-pre-generation',
  templateUrl: './pre-generation.component.html',
  styleUrls: ['./pre-generation.component.scss'],
  providers: [DatePipe]
})


export class PreGenerationComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['productcode', 'branchcode', "cardtypeCode", 'cardNo', 'expdate'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
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
  cardtypeList: any[] = [];
  typeofCard: any;

  constructor(public rest: RestService,
    private spinner: NgxSpinnerService,
    public alerts: NotificationService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { this.dataSource.paginator = this.paginator; }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.noncpckitprocode = this.rest.noncpckitprocesscode;
    this.getProductData();
    this.getBranchData();
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

  gettypeofCard() {
    if (!this.productObj || !this.productObj.productCode) {
      console.warn("No product selected");
      return;
    }

    const reqData = {
      instId: this.institutionId,
      productCode: this.productObj.productCode
    };

    const url = 'get/cardType';
    this.rest.postValidate(reqData, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.cardtypeList = res.cardtypeList || [];
        } else {
          this.alerts.errorAlert(res.respDesc, 'Error while getting Card type Details');
        }
      },
      (error) => {
        console.error('Error fetching card type:', error);
      }
    );
  }

  isFilterValid(): boolean {
    if (this.filtervalue === 'all') return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'product' && this.productObj) return !!this.fromDate && !!this.toDate && !!this.typeofCard;
    if (this.filtervalue === 'branch' && this.branchObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'both' && this.productObj && this.branchObj) return !!this.fromDate && !!this.toDate;

    return false;
  }

  onFromDateChange(event: any): void {
    if (this.toDate && this.toDate < this.fromDate!) {
      this.toDate = null;
    }
  }

  getFilterRecordList() {
    this.spinner.show();
    if (this.filtervalue === "all") {
      this.reqDatatofetch = {
        "instId": this.institutionId,
        "branch": "all",
        "product": "all",
        "searchType": "ALL",
        "processStatus": this.noncpckitprocode,
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
        "processStatus": this.noncpckitprocode,
        "reqType": "nonCpcType",
        "typeOfCard": this.typeofCard.typeofCard,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "branch") {
      this.reqDatatofetch = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": "all",
        "searchType": "B",
        "processStatus": this.noncpckitprocode,
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
        "processStatus": this.noncpckitprocode,
        "reqType": "nonCpcType",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    }

    let url = 'instant/encoding/prelist';
    this.rest.postValidate(this.reqDatatofetch, url).subscribe((res: any) => {

      if (res.respCode == '00') {
        this.cdr.detectChanges();
        this.data = res.authList;
        this.spinner.hide();
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert("Pre File Generate", res.respDesc);
      }
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  generateprefile() {

    // if ((this.sftpvalue == null || this.sftpvalue == "") && (this.profiletype == null || this.profiletype == "")) {
    //  this.toastr.error("Missing Data", "Please select sftp and profile type");
    // } else {
    //const profilename = this.sftpvalue.split('_');
    this.spinner.show();
    const reqData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      "preType": this.profiletype,
      // "sftpName": profilename[1],
      "cardDetails": this.data
    }
    let url = 'instant/encoding/embossing';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {

      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.successAlert("Pre File Generate", res.respDesc);
        this.showrecords = false;
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000)
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert("Pre File Generate", res.respDesc);
      }
    })

  }

  cancelprefile() {
    this.showrecords = false;
  }

  clearfilter() {
    this.productObj = "";
    this.branchObj = "";
  }

}

