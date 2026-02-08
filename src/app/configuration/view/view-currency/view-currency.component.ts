import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { RestService } from 'app/services/rest.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

export interface PeriodicElement {
  branchcode: string;
  branchname: string;
  reorderlevel: string;
}


@Component({
  selector: 'app-view-currency',
  templateUrl: './view-currency.component.html',
  styleUrls: ['./view-currency.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})


export class ViewCurrencyComponent implements OnInit {

  currencyFromGroup = new FormGroup({
    currencyCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    currencyDesc: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(25)]),
  })
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  institutionId: any;
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['sno', 'currencyCode', 'currencyDesc', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  columns: any = [];
  showrecords: boolean = false;
  mode: any = 'L';
  userData: any;
  userName: string;
  currencyCode: any;

  constructor(
    public alerts: NotificationService,
    public alertService: NotificationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private cdr: ChangeDetectorRef) {
    this.userName = sessionStorage.getItem('Username');
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getCurrencyList();
  }


  getCurrencyList() {
    this.spinner.show();
    this.rest.getwithHeader('currency/get').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.data = res.currencyList;
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.data);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Currecny List", "Unable to get Currency list");
        }
      });
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource<PeriodicElement>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  addCurrency() {
    const data = this.currencyFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'currency/edit'
    } else {
      url = 'currency/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.currencyFromGroup.reset();
            this.alerts.successAlert("Currency Details", res.respDesc);
            if (this.mode === 'E') {
              this.backList();
              this.getCurrencyList();
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.backList();
              this.getCurrencyList();
            }
          } else {
            this.alerts.errorAlert("Currency Details", res.respDesc);
          }
        } else {
          this.alerts.errorAlert("Currency Details", res.respDesc);
        }

      })
    }
  }

  cancelBranch() {
    this.currencyFromGroup.reset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    if (this.mode === "E") {
      this.currencyFromGroup.controls['currencyCode'].disable()
    } else {
      this.currencyFromGroup.controls['currencyCode'].enable()
    }

    this.currencyFromGroup.patchValue({
      "currencyCode": item.currencyCode,
      "currencyDesc": item.currencyDesc,
      "instId": item.instId,
      "username": item.username,
    });
  }

  backList() {
    this.currencyFromGroup.reset();
    this.mode = 'L';
    this.currencyFromGroup.controls['currencyCode'].enable();
    this.getCurrencyList();
  }

  clickAdd() {
    this.currencyFromGroup.reset();
    this.mode = 'A';
  }

  clear() {
    this.currencyFromGroup.reset();
  }

  deleteCurrency(item: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to delete-" + item.currencyDesc + "!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.initDeleteApi(item);
      }
    })

  }

  initDeleteApi(item) {
    this.spinner.show();

    let deleteData = {
      "instId": this.institutionId,
      "username": item.username,
      "currencyCode": item.currencyCode

    }

    this.currencyCode = item.currencyCode;

    var url = "currency/delete" + this.currencyCode;

    this.rest.postValidate(deleteData, "currency/delete").subscribe((res: any) => {

      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert("Currency Details", res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getCurrencyList();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert("Currency Details", res.respDesc);
      }
    });
  }

  add(mode: any) {
    this.mode = mode;
  }

}






