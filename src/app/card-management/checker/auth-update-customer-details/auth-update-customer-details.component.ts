

import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

export interface PeriodicElement {
  productcode: string;
  branchcode: string;
  chn: string;
  customerName: string;
  accountNumber: string;
  dateofBrith: Date;
  mobileNumber: string;
  address: string;
}

@Component({
  selector: 'app-auth-update-customer-details',
  templateUrl: './auth-update-customer-details.component.html',
  styleUrls: ['./auth-update-customer-details.component.scss'],
  providers: [DatePipe]
})

export class AuthUpdateCustomerDetailsComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['select', 'cardNo', 'customerName', 'accountNumber', 'dateofBrith', 'mobileNumber'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  institutionId: string;
  productlist: any;
  branchlist: any;
  productObj: any;
  branchObj: any;
  showrecords: boolean = false;
  filtervalue: any;
  reqData: { instId: string; branch: string; product: string; searchType: string; processStatus: string; };
  listtoissue: any = [];
  instantauthcardprocesscode: any;
  filteredList1: any;
  filteredList2: any;
  fromDate: Date;
  toDate: Date;
  today: Date = new Date();

  constructor(private spinner: NgxSpinnerService,
    public rest: RestService, public alerts: NotificationService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { this.dataSource.paginator = this.paginator; }



  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
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
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;

    // First check whether data source length is greater than current page index multiply by page size.
    // If yes then endIdex will be current page index multiply by page size.
    // If not then select the remaining elements in current page only.
    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      // tslint:disable-next-line:max-line-length
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }

    return numSelected === endIndex;
  }


  getFilterRecordList() {
    let postdata = {
      "instId": this.institutionId,
      "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
      "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
    };

    const url = 'cardmaintain/authlist';
    this.rest.postValidate(postdata, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.data = res.AuthorizeCustomerDetails;
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.spinner.hide();
        this.alerts.errorAlert('Update Customer Details', res.respDesc);
      }
    })
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

  isFilterValid(): boolean {
    return !!this.fromDate && !!this.toDate;
  }

  issueCard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Update Customer Details', 'Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'cardmaintain/authCustomerdetails';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert('Update Customer Details', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.errorAlert('Update Customer Details', res.respDesc);
        }
      })
    }
  }

  rejectCard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Update Customer Details', 'Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'cardmaintain/rejectCustomerdetails';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert('Update Customer Details', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.errorAlert('Update Customer Details', res.respDesc);
        }
      })
    }
  }


  cancelinstant() {
    this.selection.clear();
  }



  onChange(deviceValue) {
  }


  searchData(filterValue: string) {
  }

  clearfilter() {
    this.productObj = "";
    this.branchObj = "";
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


}

