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
  selector: 'app-auth-account-sub-type',
  templateUrl: './auth-account-sub-type.component.html',
  styleUrls: ['./auth-account-sub-type.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class AuthAccountSubTypeComponent implements OnInit {

  AccountSubTypeFromGroup = new FormGroup({
    accttype: new FormControl('', [Validators.required]),
    accountClasses: new FormControl('', [Validators.required]),
    acctSubTypeCode: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    acctSubTypeDesc: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(100)]),
  })
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  institutionId: any;
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['sno', 'acctSubTypeCode', 'acctSubTypeDesc', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  columns: any = [];
  showrecords: boolean = false;
  mode: any = 'L';
  userData: any;
  userName: string;
  acctSubTypeCode: any;
  acctTypeList = [];

  constructor(
    public alerts: NotificationService,
    public alertService: NotificationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public rest: RestService,
    private cdr: ChangeDetectorRef) {
    this.userName = sessionStorage.getItem('Username');
  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getAccTypeList();
  }


  getAccTypeList() {
    this.spinner.show();
    this.rest.getwithHeader('accountsubType/getAuthlist').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.data = res.accountsubType;
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.data);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Account Sub Type Details", "Unable to get Account Sub Type list");
        }
      });
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource<PeriodicElement>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  authorizeAccountSubType() {
    const data = this.AccountSubTypeFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'Auth') {
      url = 'accountsubType/addAuthorize'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.AccountSubTypeFromGroup.reset();
            this.alerts.successAlert('Account Sub Type Details', res.respDesc);
            if (this.mode === 'Auth') {
              this.backList();
              this.getAccTypeList();
            }
          } else {
            this.alerts.errorAlert('Account Sub Type LDetailsist', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('Account Sub Type Details', res.respDesc);
        }

      })
    }
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    this.AccountSubTypeFromGroup.patchValue({
      "accttype": item.accttype,
      "acctSubTypeCode": item.acctSubTypeCode,
      "acctSubTypeDesc": item.acctSubTypeDesc,
      "accountClasses": item.accountClasses,
      "instId": item.instId,
      "username": item.username,
    });
  }

  rejectAccountSubType() {
    const data = this.AccountSubTypeFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'Auth') {
      url = 'accountsubType/reject'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.AccountSubTypeFromGroup.reset();
            this.alerts.successAlert('Account Sub Type Details', res.respDesc);
            if (this.mode === 'Auth') {
              this.backList();
              this.getAccTypeList();
            }
          } else {
            this.alerts.errorAlert('Account Sub Type Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('Account Sub Type Details', res.respDesc);
        }

      })
    }
  }

  cancelBranch() {
    this.AccountSubTypeFromGroup.reset();
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

  backList() {
    this.AccountSubTypeFromGroup.reset();
    this.mode = 'L';
    this.AccountSubTypeFromGroup.controls['acctSubTypeCode'].enable();
    this.getAccTypeList();
  }

  clickAdd() {
    this.AccountSubTypeFromGroup.reset();
    this.mode = 'A';
  }

  clear() {
    this.AccountSubTypeFromGroup.reset();
  }

}





