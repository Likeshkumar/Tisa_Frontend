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
  selector: 'app-account-sub-type',
  templateUrl: './account-sub-type.component.html',
  styleUrls: ['./account-sub-type.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class AccountSubTypeComponent implements OnInit {

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
    this.getAccType();
  }


  getAccTypeList() {
    this.spinner.show();
    this.rest.getwithHeader('accountsubType/get').subscribe(
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
          this.alerts.errorAlert("Account Sub Type List", "Unable to get Account Sub Type list");
        }
      });
  }

  getAccType() {
    let reqData = {
      "instId": this.institutionId,
    }
    let url = 'get/acctType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.acctTypeList = res.accountTypeList;
      }
    })
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource<PeriodicElement>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  AddAccountSubType() {
    const data = this.AccountSubTypeFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'accountsubType/edit'
    } else {
      url = 'accountsubType/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.AccountSubTypeFromGroup.reset();
            this.alerts.successAlert("Account Sub Type List", res.respDesc);
            if (this.mode === 'E') {
              this.backList();
              this.getAccTypeList();
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.backList();
              this.getAccTypeList();
            }
          } else {
            this.alerts.errorAlert("Account Sub Type List", res.respDesc);
          }
        } else {
          this.alerts.errorAlert("Account Sub Type List", res.respDesc);
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

  onRowClick(item: any, action: any) {
    this.mode = action;
    if (this.mode === "E") {
      this.AccountSubTypeFromGroup.controls['accttype'].disable()
      this.AccountSubTypeFromGroup.controls['acctSubTypeCode'].disable()
    } else {
      this.AccountSubTypeFromGroup.controls['accttype'].enable()
      this.AccountSubTypeFromGroup.controls['acctSubTypeCode'].enable()
    }

    this.AccountSubTypeFromGroup.patchValue({
      "accttype": item.accttype,
      "acctSubTypeCode": item.acctSubTypeCode,
      "acctSubTypeDesc": item.acctSubTypeDesc,
      "accountClasses": item.accountClasses,
      "instId": item.instId,
      "username": item.username,
    });
  }

  backList() {
    this.AccountSubTypeFromGroup.reset();
    this.mode = 'L';
    this.AccountSubTypeFromGroup.controls['accttype'].enable()
    this.AccountSubTypeFromGroup.controls['acctSubTypeCode'].enable()
    this.getAccTypeList();
  }

  clickAdd() {
    this.AccountSubTypeFromGroup.reset();
    this.mode = 'A';
  }

  clear() {
    this.AccountSubTypeFromGroup.reset();
  }

  deleteCurrency(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to delete-" + item.acctSubTypeDesc + "!",
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
      "accttype": item.accttype,
      "acctSubTypeCode": item.acctSubTypeCode,
      "acctSubTypeDesc": item.acctSubTypeDesc,
      "instId": item.instId,
      "username": item.username,
    }

    this.acctSubTypeCode = item.acctSubTypeCode;

    this.rest.postValidate(deleteData, "accountsubType/delete").subscribe((res: any) => {
      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert("Account Sub Type List", res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getAccTypeList();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert("Account Sub Type List", res.respDesc);
      }
    });
  }

  add(mode: any) {
    this.mode = mode;
  }

}





