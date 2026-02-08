
import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';


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
  selector: 'app-auth-receive-cards',
  templateUrl: './auth-receive-cards.component.html',
  styleUrls: ['./auth-receive-cards.component.scss']
})



export class AuthReceiveCardsComponent implements OnInit {

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'cardtypecode', 'cardNo', 'expdate'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  data = [];
  columns: any = [];
  institutionId: string;
  batchlist: any;
  batchnum: any = null;
  showrecords: boolean = false;
  total$: any;
  listtoreceive = [];


  constructor(private spinner: NgxSpinnerService,
    public rest: RestService,
    public alerts: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,) { this.dataSource.paginator = this.paginator; }

  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
    if (this.institutionId) {
      this.getbatchlist();
    }
  }


  getbatchlist() {
    this.spinner.show();
    const reqData = {
      "instId": this.institutionId,
      "processStatus": "04"
    }
    let url = 'get/batchInsAuthReceiveList ';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.batchlist = res.batchReceiveList;
      } else {
        this.spinner.hide();
        this.alerts.errorAlert(res.respDesc, "Receive Cards");
      }
    })

  }

  masterToggle(checkboxChange: MatCheckboxChange) {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }


  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }



  checkboxLabel(row): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }



  getFilterRecordList() {
    if (this.batchnum == null || this.batchnum == undefined) {
      this.alerts.showAlert("Batch No Missing", "Please select batch No")
    } else {
      this.spinner.show();
      const reqData = {
        "instId": this.institutionId,
        "batchNo": this.batchnum,
        "processStatus": "04",
      }
      let url = 'instant/receive/authlist';
      this.rest.postValidate(reqData, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.data = res.receiveCardsList;
          setTimeout(() => {
            this.initTables(this.data);
            this.showrecords = true;
          }, 10);
        } else {
          this.spinner.hide();
          this.cdr.detectChanges();
          this.alerts.errorAlert("Receive Cards", res.respDesc);
        }
      })
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

  authorizereceivecard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Receive Cards', 'Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "batchNo": this.batchnum,
        "cardDetails": this.selection.selected
      }
      let url = 'instant/receive/authorize';
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

  rejectreceivecard() {
    if (this.selection.selected.length == 0) {
      this.alerts.showAlert('Receive Cards', 'Please select records');
    } else {
      this.spinner.show();
      let reqDataauthorise = {
        "instId": this.institutionId,
        "username": this.rest.readData('Username'),
        "batchNo": this.batchnum,
        "cardDetails": this.selection.selected
      }
      let url = 'instant/receive/rejectAuthorize';
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

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  cancelreceive() {

  }


}


