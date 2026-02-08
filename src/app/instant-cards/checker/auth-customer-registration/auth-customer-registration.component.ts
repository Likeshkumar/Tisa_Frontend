
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
  selector: 'app-auth-customer-registration',
  templateUrl: './auth-customer-registration.component.html',
  styleUrls: ['./auth-customer-registration.component.scss'],
  providers: [DatePipe]
})



export class AuthCustomerRegistrationComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['select', 'cardNo', 'customerName', 'accountNumber', 'dateofBrith', 'mobileNumber', 'address'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  isBranchDropdownDisabled: boolean = false;
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
    this.instantauthcardprocesscode = this.rest.instantauthcardprocesscode;
    this.productlist = this.getProductData();
    this.branchlist = this.getBranchData();
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
    };

    const url = 'get/branch';
  this.rest.postValidate(reqData, url).subscribe((res: any) => {
    if (res.respCode === '00') {
      this.branchlist = res.branchList || [];
      this.filteredList2 = this.branchlist.slice();

      const savedBranchCode = this.rest.readData('branchCode');
      if (savedBranchCode && savedBranchCode !== 'null' && savedBranchCode !== '') {
        const selectedBranch = this.branchlist.find(b => b.branchCode === savedBranchCode);
        if (selectedBranch) {
          this.branchObj = selectedBranch;
          this.isBranchDropdownDisabled = true;
        }
      } else {
        this.isBranchDropdownDisabled = false;
        this.branchObj = null;
      }

    } else {
      this.alerts.errorAlert(res.respDesc, 'Error while getting branch details');
    }
  });



    // let url = 'get/branch';
    // this.rest.postValidate(reqData, url).subscribe((res: any) => {
    //   if (res.respCode == '00') {
    //     this.branchlist = res.branchList;
    //   }
    // });
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
    this.spinner.show();
    if (this.filtervalue === "all") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": "all",
        "product": "all",
        "searchType": "ALL",
        "processStatus": this.instantauthcardprocesscode,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      } as any;
    } else if (this.filtervalue === "product") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": "all",
        "product": this.productObj.productCode,
        "searchType": "P",
        "processStatus": this.instantauthcardprocesscode,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      } as any;
    // } else if (this.filtervalue === "branch") {
    //   this.reqData = {
    //     "instId": this.institutionId,
    //     "branch": this.branchObj.branchCode,
    //     "product": "all",
    //     "searchType": "B",
    //     "processStatus": this.instantauthcardprocesscode,
    //     "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
    //     "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
    //   } as any;

    } else if (this.filtervalue === "branch") { 
        // if (this.rest.readData('branchCode') === 'null') {
        if (this.rest.readData('branchCode') === 'null' || this.rest.readData('branchCode') === '') {
          this.reqData = {
            instId: this.institutionId,
            branch: this.branchObj.branchCode,
            product: "all",
            searchType: "B",
            processStatus: this.instantauthcardprocesscode,
            fromDate: this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
            toDate: this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
          }as any;
        } else {
          this.reqData = {
            instId: this.institutionId,
            branch: this.rest.readData('branchCode'),
            product: "all",
            searchType: "B",
            processStatus: this.instantauthcardprocesscode,
            fromDate: this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
            toDate: this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
          }as any;
        }




    } else if (this.filtervalue === "both") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": this.productObj.productCode,
        "searchType": "BP",
        "processStatus": this.instantauthcardprocesscode,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      } as any;
    }

    let url = 'instant/auth/card-list';
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
        this.alerts.errorAlert('Customer Registration', res.respDesc);
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
    if (this.filtervalue === 'all') return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'product' && this.productObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'branch' && this.branchObj) return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'both' && this.productObj && this.branchObj) return !!this.fromDate && !!this.toDate;

    return false;
  }


  issueCard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Customer Registration', 'Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'instant/auth/card';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert('Customer Registration', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.errorAlert('Customer Registration', res.respDesc);
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

  // clearfilter() {
  //   this.productObj = "";
  //   this.branchObj = "";
  // }

  clearfilter() {
  this.productObj = "";

  const savedBranchCode = this.rest.readData('branchCode');
  if (savedBranchCode && savedBranchCode !== 'null' && savedBranchCode !== '') {
    this.branchObj = this.branchlist.find(b => b.branchCode === savedBranchCode);
    this.isBranchDropdownDisabled = true;
  } else {
    this.branchObj = null;
    this.isBranchDropdownDisabled = false;
  }
}




  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


}


