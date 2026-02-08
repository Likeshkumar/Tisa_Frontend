import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
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

interface TxnLimits {
  [key: string]: string;
}

interface LimitRecord {
  encryptChn: string;
  productcode: string;
  mobNo: string;
  typeOfCard: string;
  txnLimits: TxnLimits;
  chnMask: string;
  customerId: string;
  chn: string;
  primaryAccountnumber: string;
  customerName: string;
}

@Component({
  selector: 'app-auth-individual-card-limit',
  templateUrl: './auth-individual-card-limit.component.html',
  styleUrls: ['./auth-individual-card-limit.component.scss'],
  providers: [DatePipe]
})

export class AuthIndividualCardLimitComponent implements OnInit {
  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;

  //displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'cardNo', 'expdate', 'accountNo', 'customerId', 'customername', 'cardtype'];

  // displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'cardNo', 'accountNo', 'mobileNumber', 'customerId', 'customername'];


  displayedColumns: string[] = ['select', 'chnMask', 'customerId', 'primaryAccountnumber', 'customerName', 'mobNo', 'fromDate', 'toDate', 'cumMaxWdlAmt', 'cumMaxWdlCnt'];


  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  cardListforcvv: any;
  reqData: any;
  userData: any;
  showrecords: boolean = false;
  filtervalue: any;
  listtogeneratecvv = [];
  institutionId: any;
  selectall: boolean = false;
  cvvgenerateprocode: any;
  filteredList2: any[] = [];
  branchObj: any = null;
  branchlist: any[] = [];
  productlist: any[] = [];
  filteredList1: any[] = [];
  productObj: any = null;
  fromDate: Date;
  toDate: Date;
  today: Date = new Date();


  constructor(
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private router: Router,
    private datePipe: DatePipe,
    public alerts: NotificationService,
    private cdr: ChangeDetectorRef,) { }



  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.cvvgenerateprocode = this.rest.cvvgenerateprocesscode;
    this.getBranchData();
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
    return this.branchObj ? true : false;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  masterToggle(checkboxChange: MatCheckboxChange) {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }

  checkboxLabel(row): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  isSelectedPage() {

    const numSelected = this.selection.selected.length;
    this.listtogeneratecvv = this.selection.selected;
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;

    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }

    return numSelected === endIndex;
  }


  getFilterRecordList() {
    this.spinner.show();

    const reqData = {
      instId: this.institutionId,
      branch: this.branchObj.branchCode,
    };

    const url = 'limit/getAuthList';

    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      this.spinner.hide();
      this.cdr.detectChanges();

      if (res.respCode === '00') {
        const rawData = res.LimitResponse || [];

        // Map and clean data
        this.data = rawData.map((item: any) => {
          const limits = item.txnLimits || {};
          return {
            encryptChn: item.encryptChn,
            productcode: item.productcode,
            mobNo: item.mobNo,
            typeOfCard: item.typeOfCard,
            chnMask: item.chnMask,
            customerId: item.customerId,
            chn: item.chn,
            primaryAccountnumber: item.primaryAccountnumber,
            customerName: item.customerName,
            fromDate: item.fromDate,
            toDate: item.toDate,
            cumMaxWdlAmt: item.cumMaxWdlAmt,
            cumMaxWdlCnt: item.cumMaxWdlCnt,
            ...limits,
          } as LimitRecord;
        });


        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.alerts.errorAlert("Individual Card Limit", res.respDesc);
      }
    });
  }


  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  onCheckboxClick(selectCheckBoxArr) {
    this.listtogeneratecvv = selectCheckBoxArr;
  }


  generatecvv() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Please select the records', 'Individual Card Limit');
    }
    else {
      this.spinner.show();
      let reqcvvgenerate = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }

      let url = 'limit/addAuthorize';
      this.rest.postValidate(reqcvvgenerate, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert("Individual Card Limit", res.respDesc);
          this.showrecords = false;
          setTimeout(() => {
            this.reloadCurrentRoute();
          }, 3000)
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert("Individual Card Limit", res.respDesc);
        }

      })
    }
  }

  rejectcvv() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Please select the records', 'Individual Card Limit');
    }
    else {
      this.spinner.show();
      let reqcvvgenerate = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }

      let url = 'limit/reject';
      this.rest.postValidate(reqcvvgenerate, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert("Individual Card Limit", res.respDesc);
          this.showrecords = false;
          setTimeout(() => {
            this.reloadCurrentRoute();
          }, 3000)
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert("Individual Card Limit", res.respDesc);
        }

      })
    }
  }


  cancelcvvgenerate() {
    this.selection.clear();
  }

  clearfilter() {
    this.productObj = "";
    this.branchObj = "";
  }

}

