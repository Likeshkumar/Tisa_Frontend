
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
  selector: 'app-fee-debit-via-cbs',
  templateUrl: './fee-debit-via-cbs.component.html',
  styleUrls: ['./fee-debit-via-cbs.component.scss'],
  providers: [DatePipe]
})

export class FeeDebitViaCbsComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = ['select', 'cardNo', 'accountNumber', 'customerId', 'branchCode', 'glAccount', 'feeAmount', 'taxAmount', 'accountClassues', 'periodicity', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  institutionId: string;
  branchList: any;
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
  branchcode: any;
  today: Date = new Date();
  selectedOption: string = '';
  userInput: string = '';
  showCardDetails: boolean = false;
  showcardDetails: boolean = false;

  constructor(private spinner: NgxSpinnerService,
    public rest: RestService, public alerts: NotificationService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { this.dataSource.paginator = this.paginator; }


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


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.branchList = this.getBranchData();

    this.data = [{
      cardNo: '758974',
      accountNumber: 'Proprietrary bin',
      customerId: '16',
      feeAmount: 'Card Type',
      tax: 'Head office',
      action: 'Thales',

    },
    {
      cardNo: '454595',
      accountNumber: 'Visa Network',
      customerId: '16',
      feeAmount: 'Card Type',
      tax: 'Tambaram main branch',
      action: 'Thales',

    },
    {
      cardNo: '589698',
      accountNumber: 'Master Card',
      customerId: '19',
      feeAmount: 'Card Type',
      tax: 'ECR',
      action: 'Thales',

    }]

    this.dataSource = new MatTableDataSource(this.data);

    this.showrecords = true;
  }

  onFromDateChange(event: any): void {
    if (this.toDate && this.toDate < this.fromDate!) {
      this.toDate = null;
    }

  }

  onSelectionChange(): void {
    this.userInput = '';
    this.data = [];
    this.showrecords = false;
    this.showCardDetails = false;
    this.dataSource = new MatTableDataSource(this.data);
  }

  getLabelForSelection(option: string): string {
    switch (option) {
      case 'account':
        return 'Enter the Account Number';
      case 'customerName':
        return 'Enter the Customer Name';
      case 'customerId':
        return 'Enter the Customer ID';
      case 'cardNumber':
        return 'Enter the Card Number';
      default:
        return 'Enter Value';
    }
  }

  getPlaceholderForSelection(option: string): string {
    switch (option) {
      case 'account':
        return 'Enter Account Number';
      case 'customerName':
        return 'Enter Customer Name';
      case 'customerId':
        return 'Enter Customer ID';
      case 'cardNumber':
        return 'Enter Card Number';
      default:
        return 'Enter Value';
    }
  }

  getMinLengthForSelection(option: string): number {
    switch (option) {
      case 'account':
        return 16;
      case 'customerName':
        return 4;
      case 'customerId':
        return 6;
      case 'cardNumber':
        return 16;
      default:
        return 0;
    }
  }

  getMaxLengthForSelection(option: string): number {
    switch (option) {
      case 'account':
        return 16;
      case 'customerName':
        return 25;
      case 'customerId':
        return 6;
      case 'cardNumber':
        return 16;
      default:
        return 0;
    }
  }

  getPatternForSelection(option: string): string {
    return '^[0-9]*$';
  }


  getErrorMessage(inputModel: any, option: string): string {
    if (inputModel.errors?.required) {
      return `${this.getLabelForSelection(option)} is required`;
    }
    if (inputModel.errors?.minlength) {
      return `${this.getLabelForSelection(option)} must be at least ${this.getMinLengthForSelection(option)} digit long`;
    }
    if (inputModel.errors?.maxlength) {
      return `${this.getLabelForSelection(option)} cannot exceed ${this.getMaxLengthForSelection(option)} digit`;
    }

    if (inputModel.errors?.pattern) {
      return `${this.getLabelForSelection(option)} must contain only numbers`;
    }

    return '';
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
    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }

    return numSelected === endIndex;
  }


  getFilterRecordList() {
    let postData: any = {
      "instId": this.institutionId,
      "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
      "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy'),
      "branchCode": this.branchcode,
      "filtervalue": this.filtervalue
    };

    const url = 'limit/getAuthList';
    this.rest.postValidate(postData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.data = res.RetryCountDetails;
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.spinner.hide();
        this.alerts.errorAlert('Fee Debit Via CBS', res.respDesc);
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
    if (this.filtervalue) return !!this.fromDate && !!this.toDate && !!this.branchcode;

    return false;
  }

  issueCard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Fee Debit Via CBS','Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'maintainence/retrycount/add';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {

        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.successAlert('Fee Debit Via CBS', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.cdr.detectChanges();
          this.alerts.errorAlert('Fee Debit Via CBS', res.respDesc);
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


