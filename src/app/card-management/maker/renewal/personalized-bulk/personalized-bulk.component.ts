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
import { MatDatepicker } from '@angular/material/datepicker';



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
  selector: 'app-personalized-bulk',
  templateUrl: './personalized-bulk.component.html',
  styleUrls: ['./personalized-bulk.component.scss'],
  providers: [DatePipe]
})


export class PersonalizedBulkComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['select', 'chnMask', 'customerId', 'acctno', 'expDate', 'embName',];
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
  //selDate?: Date;
  userData: any;
  today: Date = new Date();
  action: any;

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
    // if (this.productObj && this.branchObj) return !!this.fromDate && !!this.toDate && !!this.action;
    if (this.productObj && this.branchObj) return !!this.selectDate;
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

    let reqData = {
      "instId": this.institutionId,
      "branch": this.branchObj.branchCode,
      "product": this.productObj.productCode,
      "action": this.action,
      //"fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
      //"toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy'),
      "selectDate":this.datePipe.transform(this.selectDate, 'yyyyMM')
    } as any;

    let url = 'maintainence/renewal/details';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.data = res.RenewalCardList;
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert('Personalized Bulk Renewal', res.respDesc);
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

  issueCard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Personalized Bulk Renewal', 'Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'maintainence/renewal/card';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.successAlert('Personalized Bulk Renewal', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.errorAlert('Personalized Bulk Renewal', res.respDesc);
        }
      })
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

  selectDate: Date = new Date(2029, 9); 
  selectedYear: number = this.selectDate.getFullYear();

  setYear(normalizedYear: Date): void {
    this.selectedYear = normalizedYear.getFullYear();
  }

  setMonth(normalizedMonth: Date, datepicker: MatDatepicker<Date>): void {
    const month = normalizedMonth.getMonth();
    this.selectDate = new Date(this.selectedYear, month, 1);
    datepicker.close();
  }

  formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const dates = `${month}/${year}`;
    return dates;
  }
}






