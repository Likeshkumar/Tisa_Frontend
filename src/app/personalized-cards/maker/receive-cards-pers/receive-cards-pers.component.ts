

import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';

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
  selector: 'app-receive-cards-pers',
  templateUrl: './receive-cards-pers.component.html',
  styleUrls: ['./receive-cards-pers.component.scss']
})

export class ReceiveCardsPersComponent implements OnInit {
  
  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'cardNo', 'accountNo', 'mobileNumber', 'customerId', 'customername'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  institutionId: string;
  batchlist: any;
  batchnum: any;
  showrecords: boolean = false;
  total$: any;
  userData: any;


  constructor(
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private router: Router,
    public alerts: NotificationService,
    private cdr: ChangeDetectorRef,
  ) { this.dataSource.paginator = this.paginator; }



  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    if (this.institutionId) {
      this.getbatchlist();
    }
  }



  getbatchlist() {
    this.spinner.show();
    const reqData = {
      "instName": this.institutionId
    }
    let url = 'get/batch';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.batchlist = res.batchList;
      } else {
        this.spinner.hide();
        this.alerts.showError(res.respDesc, 'Batch List Details');

      }
    })

  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFilterRecordList() {
    if (this.batchnum == null || this.batchnum == "") {
      this.alerts.errorAlert("Batch No missing", "Please select the batch");
    } else {
      this.spinner.show();
      const reqData = {
        "instId": this.institutionId,
        "batchNo": this.batchnum,
      }
      let url = 'receive/card-list';
      this.rest.postValidate(reqData, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.data = res.receiveCardList || [];
          setTimeout(() => {
            this.initTables(this.data);
            this.showrecords = true;
          }, 10);
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert('Receive-card', res.respDesc);
        }
      })
    }
  }


  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  receivecard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Please select records', 'Receive Card');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "batchNo": this.batchnum,
        "cardDetails": this.selection.selected
      }
      let url = 'receive/card-generate';
      this.rest.postValidate(reqDataauthorise, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.successAlert('Receive Cards', res.respDesc);
          this.showrecords = false;
          this.reloadCurrentRoute();
        } else {
          this.spinner.hide();
          this.selection.clear();
          this.alerts.errorAlert('Receive Cards', res.respDesc);
        }
      })
    }
  }

  masterToggle(checkboxChange: MatCheckboxChange) {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }


  checkboxLabel(row): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  cancelreceive() {
    this.selection.clear();
  }

}

