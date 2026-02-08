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
  selector: 'app-auth-issuance-of-cards-pers',
  templateUrl: './auth-issuance-of-cards-pers.component.html',
  styleUrls: ['./auth-issuance-of-cards-pers.component.scss'],
  providers: [DatePipe]
})


export class AuthIssuanceOfCardsPersComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'cardNo', 'expdate', 'accountNo', 'customerId', 'customername', 'cardtype'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  // Sathish
  isBranchDropdownDisabled: boolean = false;
  data = [];
  userData: any;
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
  fromDate: Date;
  toDate: Date;
  today: Date = new Date();

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
    this.issuecardprocode = this.rest.Authissuecardprocesscode;
    this.getProductData();
    this.getBranchData();
  }

  getProductData() {
    const postdata = {
      instId: this.institutionId,
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


    // this.rest.postValidate(reqData, url).subscribe((res: any) => {
    //   if (res.respCode === '00') {
    //     this.branchlist = res.branchList || [];
    //     this.filteredList2 = this.branchlist.slice();
    //   } else {
    //     this.alerts.errorAlert(res.respDesc, 'Error while getting branch details');
    //   }
    // });
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

  getFilterRecordList() {

    this.spinner.show();
    if (this.filtervalue === "all") {
      this.reqData = {

        "instId": this.institutionId,
        "branch": "all",
        "product": "all",
        "searchType": "ALL",
        "processStatus": this.issuecardprocode,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      } as any;
    } else if (this.filtervalue === "product") {

      this.reqData = {
        "instId": this.institutionId,
        "branch": "all",
        "product": this.productObj.productCode,
        "searchType": "P",
        "processStatus": this.issuecardprocode,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      } as any;

    // } else if (this.filtervalue === "branch") {
    //   this.reqData = {
    //     "instId": this.institutionId,
    //     "branch": this.branchObj.branchCode,
    //     "product": "all",
    //     "searchType": "B",
    //     "processStatus": this.issuecardprocode,
    //     "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
    //     "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
    //   } as any;
    //sathish
    } else if (this.filtervalue === "branch") { 
        // if (this.rest.readData('branchCode') === 'null') {
        if (this.rest.readData('branchCode') === 'null' || this.rest.readData('branchCode') === '') {
          this.reqData = {
            "instId": this.institutionId,
            "branch": this.branchObj.branchCode,
            "product": "all",
            "searchType": "B",
            "processStatus": this.issuecardprocode,
            "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
            "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
          }as any;
        } else {
          this.reqData = {
            "instId": this.institutionId,
            "branch": this.rest.readData('branchCode'),
            "product": "all",
            "searchType": "B",
            "processStatus": this.issuecardprocode,
            "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
            "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
          }as any;
        }

    } else if (this.filtervalue === "both") {
      this.reqData = {
        "instId": this.institutionId,
        "branch": this.branchObj.branchCode,
        "product": this.productObj.productCode,
        "searchType": "BP",
        "processStatus": this.issuecardprocode,
        "fromDate": this.datePipe.transform(this.fromDate, 'dd-MM-yyyy'),
        "toDate": this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      } as any;
    }

    let url = 'issuance/get/authcardlist';
    this.rest.postValidate(this.reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.data = res.issuanceAuthList;
        setTimeout(() => {
          this.initTables(this.data);
          this.showrecords = true;
        }, 10);
      } else {
        this.spinner.hide();
        this.cdr.detectChanges();
        this.alerts.errorAlert('Card - Issuance', res.respDesc);
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
      this.alerts.showAlert('Card - Issuance','Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'issuance/cardsauth';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.successAlert('Card - Issuance', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.errorAlert('Card - Issuance', res.respDesc);
        }
      })
    }
  }

  reject() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Please select records', 'Issue Card');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "cardDetails": this.selection.selected
      }
      let url = 'issuance/cardsauth';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.successAlert('Card - Issuance', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.errorAlert('Card - Issuance', res.respDesc);
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

//   clearfilter() {
//     this.productObj = "";
//     this.branchObj = "";
//   }

// }
//sathish
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
}
