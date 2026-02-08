

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

@Component({
  selector: 'app-ins-track-status',
  templateUrl: './ins-track-status.component.html',
  styleUrls: ['./ins-track-status.component.scss'],
  providers: [DatePipe]
})

export class InsTrackStatusComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = [
    'cardHolderNumber',
    'customerId',
    'acctNo',
    'customerName',
    'cardregUser',
    'cardregDate',
    'cardAuthrejUser',
    'cardAuthrejDate',
    'cardregStatus',
    'CVVGenUser',
    'CVVGenDate',
    'CVVAuthrejUser',
    'CVVAuthrejDate',
    'CVVGenStatus',
    'embGenUser',
    'embGenDate',
    'embAuthrejUser',
    'embAuthrejDate',
    'embGenStatus',
    'embFileDownUser',
    'embFileDownDate',
    'embFileDownStatus',
    'reccardUser',
    'reccardDate',
    'recAuthrejUser',
    'recAuthrejDate',
    'reccardStatus',
    'isscardUser',
    'isscardDate',
    'issAuthrejUser',
    'issAuthrejDate',
    'isscardStatus',
  ];

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
  allBranchUser: boolean = false;
  branchUser: boolean = false;
  menuItems: any = [];
  isBranchDropdownDisabled: boolean = false;
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
    this.getProductData();
    this.getBranchData();
    this.getProfileFlag();

    const savedBranchCode = this.rest.readData('branchCode');
    if (savedBranchCode && savedBranchCode !== 'null' && savedBranchCode !== '') {
      this.isBranchDropdownDisabled = true;

      setTimeout(() => {
        this.branchObj = this.branchlist.find(b => b.branchCode === savedBranchCode);
      }, 300);
    } else {
      this.isBranchDropdownDisabled = false;
    }
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

  getStatusClass(status: string): string {
    if (!status) return '';
    const normalized = status.trim().toUpperCase();
    switch (normalized) {
      case 'IN PROGRESS':
        return 'status-orange';
      case 'COMPLETED':
        return 'status-green';
      case 'REJECTED':
        return 'status-red';
      default:
        return '';
    }
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
  }

  getProfileFlag() {
    const savedMenuList = this.rest.readData('menuList');
    const savedUserDetails = this.rest.readData('UserDetails');

    if (savedMenuList && savedUserDetails) {
      try {
        const menuList = JSON.parse(savedMenuList);
        this.menuItems = menuList;

        const userDetails = JSON.parse(savedUserDetails).userDetails;
        const branchBasedProfile = userDetails && userDetails.length > 0
          ? userDetails[0].branchBasedProfile
          : null;

        if (branchBasedProfile === 'No') {
          this.allBranchUser = true;
        } else if (branchBasedProfile === 'Yes') {
          this.branchUser = true;
        }

      } catch (e) {
        console.error('Error parsing menu list or user data from storage', e);
        this.alerts.errorAlert('Invalid data format in storage.', 'Error');
      }
    } else {
      this.alerts.errorAlert('No menu list found. Please login again.', 'Error');
      this.router.navigate(['/login']);
    }
  }

  onFromDateChange(event: any): void {
    if (this.toDate && this.toDate < this.fromDate!) {
      this.toDate = null;
    }
  }


  isFilterValid(): boolean {
    if (this.filtervalue === 'product') {
      return !!this.productObj && !!this.branchObj;
    }
    return !!this.productObj && !!this.branchObj;
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
    this.listtogeneratecvv = [];
    this.spinner.show();
    if (this.filtervalue === "all") {
      this.reqData = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "product": "all",
        "branch": this.branchObj.branchCode,
      }
    } else if (this.filtervalue === "product") {
      this.reqData = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "product": this.productObj.productCode,
        "branch": this.branchObj.branchCode,
      }
    }

    let url = 'instant/auth/get/trackStatus';
    this.rest.postValidate(this.reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.data = res.issuanceList;
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);

      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert("Track Status", res.respDesc);
      }
    })
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
      this.alerts.showAlert('Please select the records', 'Track Status');
    }
    else {
      this.spinner.show();
      let reqcvvgenerate = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }

      let url = 'cvv/generate';
      this.rest.postValidate(reqcvvgenerate, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert("Track Status", res.respDesc);
          this.showrecords = false;
          setTimeout(() => {
            this.reloadCurrentRoute();
          }, 3000)
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert("Track Status", res.respDesc);
        }

      })
    }
  }


  cancelcvvgenerate() {
    this.selection.clear();
  }

  clearfilter() {
    this.productObj = "";
  }
}


