

import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-auth-cvv-generation',
  templateUrl: './auth-cvv-generation.component.html',
  styleUrls: ['./auth-cvv-generation.component.scss'],
  providers: [DatePipe]
})


export class AuthCvvGenerationComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'cardtypeCode', 'cardNo', 'expdate'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  cardListforpin: any;
  reqData: any;
  showrecords: boolean = false;
  filtervalue: any;
  listforpingenerate = [];
  institutionId: string;
  selectall: boolean = false;
  instantcardpinprocode: any;
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
    public alerts: NotificationService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) { this.dataSource.paginator = this.paginator; }



  ngOnInit(): void {


    this.institutionId = this.rest.readData('InstituteId');
    this.instantcardpinprocode = this.rest.instantcardpinprocesscode;
    this.getProductData();
    this.getBranchData();
  }

  getProductData() {
    const postdata = {
      instId: this.institutionId,
    };

    const url = 'get/product';
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
  isFilterValid(): boolean {
    if (this.filtervalue === 'all') return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'product' && this.productObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'branch' && this.branchObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'both' && this.productObj && this.branchObj) return !!this.fromDate && !!this.toDate;

    return false;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }



  checkboxLabel(row): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  isSelectedPage() {

    const numSelected = this.selection.selected.length;
    this.listforpingenerate = this.selection.selected;
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
    //this.listforpingenerate = [];
    //this.instantcardpinprocode
    this.spinner.show();
    if (this.filtervalue === "all") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": "all",
        "product": "all",
        "searchType": "ALL",
        "processStatus": "02",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "product") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": "all",
        "product": this.productObj.productCode,
        "searchType": "P",
        "processStatus": "02",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "branch") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": "all",
        "searchType": "B",
        "processStatus": "02",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    } else if (this.filtervalue === "both") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": this.productObj.productCode,
        "searchType": "BP",
        "processStatus": "02",
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      }
    }


    let url = 'instant/cvv/get/authCvv-list';
    this.rest.postValidate(this.reqData, url).subscribe((res: any) => {
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
        this.alerts.errorAlert("CVV Generation", res.respDesc);
      }
    })
  }

  authorizecvv() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('CVV Generation', 'Please select  records');
    }
    else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }

      let url = 'instant/cvv/authorize';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert("CVV Generation", res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert("CVV Generation", res.respDesc);
        }

      })
    }
  }


  rejectcvv() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('CVV Generation', 'Please select  records');
    }
    else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }

      let url = 'instant/cvv/rejectAuthorize';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert("CVV Generation", res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert("CVV Generation", res.respDesc);
        }

      })
    }
  }


  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  cancelcvv() {
    this.selection.clear();
  }

  clearfilter() {
    this.productObj = "";
    this.branchObj = "";
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCheckboxClick(selectCheckBoxArr) {
    this.listforpingenerate = selectCheckBoxArr;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

