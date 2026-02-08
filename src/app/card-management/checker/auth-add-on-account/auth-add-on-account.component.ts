
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
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
  selector: 'app-auth-add-on-account',
  templateUrl: './auth-add-on-account.component.html',
  styleUrls: ['./auth-add-on-account.component.scss'],
  providers: [DatePipe]
})


export class AuthAddOnAccountComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['select', 'cardNo', 'customerName', 'accountNumber', 'acctCode', 'subAcctType', 'currencyCode', 'accountPriority'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  institutionId: string;
  showrecords: boolean = false;
  filtervalue: any;
  reqData: { instId: string; branch: string; product: string; searchType: string; processStatus: string; };
  issueCardList: any;
  issuecardprocode: any;
  filteredList2: any[] = [];
  branchObj: any = null;
  branchlist: any[] = [];
  productlist: any[] = [];
  filteredList1: any[] = [];
  productObj: any = null;
  fromDate?: Date;
  toDate?: Date;
  userData: any;
  today: Date = new Date();
  addonflag: any;
  constructor(
    private spinner: NgxSpinnerService,
    public rest: RestService,
    public alerts: NotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,) {
    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.issuecardprocode = this.rest.issuecardprocesscode;
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
    if (this.filtervalue === 'newAddOn') return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'swap') return !!this.fromDate && !!this.toDate;
    if (this.filtervalue === 'remove') return !!this.fromDate && !!this.toDate;
    return false;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  onFromDateChange(event: any): void {
    if (this.toDate && this.toDate < this.fromDate!) {
      this.toDate = null;
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


  getFilterRecordList() {
    this.spinner.show();
    const addonFlag = this.filtervalue;
    if (['newAddOn', 'swap', 'remove'].includes(addonFlag)) {
      this.reqData = {
        "instId": this.institutionId,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy'),
        "addonflag": addonFlag
      } as any;
    }

    let url = '';
    switch (addonFlag) {
      case 'newAddOn':
        url = 'maintainence/addonAuth/AcctDetails';
        break;
      case 'swap':
        url = 'maintainence/addonAuth/AcctDetails';
        break;
      case 'remove':
        url = 'maintainence/addonAuth/AcctDetails';
        break;
    }

    if (url) {
      this.rest.postValidate(this.reqData, url).subscribe((res: any) => {
        this.spinner.hide();
        this.cdr.detectChanges();

        if (res.respCode === '00') {
          this.data = res.AddonCardDetailsList;
          setTimeout(() => {
            this.initTables(this.data);
            this.showrecords = true;
          }, 10);
        } else {
          this.alerts.errorAlert('Add On Account', res.respDesc);
        }
      }, error => {
        this.spinner.hide();
        this.alerts.errorAlert('Add On Account', 'Request failed, Please try again later.');
      });
    } else {
      this.spinner.hide();
      this.alerts.errorAlert('Add On Account', 'Invalid operation selected');
    }
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

  isSelectedPage() {

    const numSelected = this.selection.selected.length;
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;

    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }

    return numSelected === endIndex;
  }

  authorizeAddOn() {
    this.spinner.show();

    this.spinner.show();

    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Add on Account', 'Please select records');
      this.spinner.hide();
      return;
    }


    const addonFlag = this.filtervalue;

    if (['newAddOn', 'swap', 'remove'].includes(addonFlag)) {
      this.reqData = {
        instId: this.institutionId,
        username: this.rest.readData('Username'),
        cardDetails: this.selection.selected,
        addonflag: addonFlag
      } as any;
    }

    let url = '';
    switch (addonFlag) {
      case 'newAddOn':
        url = 'cardmaintain/authorize/addonAcct';
        break;
      case 'swap':
        url = 'maintainence/authorize/switchacct';
        break;
      case 'remove':
        url = 'maintainence/authorize/removeacct';
        break;
    }

    if (url) {
      this.rest.postValidate(this.reqData, url).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();

          if (res.respCode === '00') {
            this.alerts.successAlert('Add On Account', res.respDesc);
            this.showrecords = false;
            this.reloadCurrentRoute();
          } else {
            this.alerts.errorAlert('Add On Account', res.respDesc);
          }
        },
        error: () => {
          this.spinner.hide();
          this.alerts.errorAlert('Add On Account', 'Request failed. Please try again later.');
        }
      });
    } else {
      this.spinner.hide();
      this.alerts.errorAlert('Add On Account', 'Invalid operation selected.');
    }
  }


  rejectAddOn() {
    this.spinner.show();
    const addonFlag = this.filtervalue;

    this.spinner.show();

    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Add on Account', 'Please select records');
      this.spinner.hide();
      return;
    }


    if (['newAddOn', 'swap', 'remove'].includes(addonFlag)) {
      this.reqData = {
        instId: this.institutionId,
        username: this.rest.readData('Username'),
        cardDetails: this.selection.selected,
        addonflag: addonFlag
      } as any;
    }

    let url = '';
    switch (addonFlag) {
      case 'newAddOn':
        url = 'cardmaintain/reject/addonAcct';
        break;
      case 'swap':
        url = 'cardmaintain/reject/addonAcct';
        break;
      case 'remove':
        url = 'cardmaintain/reject/addonAcct';
        break;
    }

    if (url) {
      this.rest.postValidate(this.reqData, url).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();

          if (res.respCode === '00') {
            this.alerts.successAlert('Add On Account', res.respDesc);
            this.showrecords = false;
            this.reloadCurrentRoute();
          } else {
            this.alerts.errorAlert('Add On Account', res.respDesc);
          }
        },
        error: () => {
          this.spinner.hide();
          this.alerts.errorAlert('Add On Account', 'Request failed. Please try again later.');
        }
      });
    } else {
      this.spinner.hide();
      this.alerts.errorAlert('Add On Account', 'Invalid operation selected.');
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  cancelissuance() {
    this.selection.clear();
  }

  clearfilter() {
    this.productObj = "";
    this.branchObj = "";
  }

}


