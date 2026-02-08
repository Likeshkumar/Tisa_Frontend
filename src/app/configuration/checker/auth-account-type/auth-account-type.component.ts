import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RestService } from 'app/services/rest.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2';

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
  selector: 'app-auth-account-type',
  templateUrl: './auth-account-type.component.html',
  styleUrls: ['./auth-account-type.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class AuthAccountTypeComponent implements OnInit {

  paginator: MatPaginator;
  userName: string;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  displayedColumns: string[] = ['sno', 'accountType', 'description', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  filteredList1: any;
  filteredList2: any;
  productlist: any;
  binlist: any
  showrecords: boolean = false;
  productObj: any;
  institutionId: any;
  cardtype: any;
  binListdata: any;
  accountTypeFromGroup: FormGroup;
  mode: any = 'L';
  productdata: any;
  userData: any;
  isCvvRequired: boolean | null = null;
  isCvvDisabled: boolean = false;
  accountType: any;

  constructor(
    public rest: RestService,
    public dialog: MatDialog,
    public alertService: NotificationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public alerts: NotificationService,
    private fb: FormBuilder) {
    this.InitForm();
    this.userName = sessionStorage.getItem('Username');
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  InitForm() {
    this.accountTypeFromGroup = this.fb.group({
      accountType: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      description: ['', [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]],
      withdrawAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      withdrawCount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      purchaseAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      purchaseCount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      transferAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      transfereCount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    })
  }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getAccountTypeList();
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  getAccountTypeList() {
    this.spinner.show();
    this.rest.getwithHeader('accountinfo/getAuthlist').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.data = res.accountInfo;
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.data);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Account type Details", "Unable to get account type list");
        }
      });

  }

  authorizeAccountType() {
    const data = this.accountTypeFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'Auth') {
      url = 'accountinfo/addAuthorize'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.accountTypeFromGroup.reset();
            this.alerts.successAlert("Account Type Details", res.respDesc);
            if (this.mode === 'Auth') {
              this.backList();
              this.getAccountTypeList();
            }
          } else {
            this.alerts.errorAlert("Account Type Details", res.respDesc);
          }
        } else {
          this.alerts.errorAlert("Account Type Details", res.respDesc);
        }

      })
    }
  }

  rejectAccountType() {
    const data = this.accountTypeFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'Auth') {
      url = 'accountinfo/reject'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.accountTypeFromGroup.reset();
            this.alerts.successAlert("Account Type Details", res.respDesc);
            if (this.mode === 'Auth') {
              this.backList();
              this.getAccountTypeList();
            }
          } else {
            this.alerts.errorAlert("Account Type Details", res.respDesc);
          }
        } else {
          this.alerts.errorAlert("Account Type Details", res.respDesc);
        }

      })
    }
  }

  backList() {
    this.accountTypeFromGroup.reset();
    this.mode = 'L';
    this.accountTypeFromGroup.controls['accountType'].enable();
    this.getAccountTypeList();
  }

  addAccount(mode: any) {
    this.mode = mode;
  }

  clear() {
    this.accountTypeFromGroup.reset();
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    this.accountTypeFromGroup.patchValue({
      "instId": item.instId,
      "username": item.username,
      "accountType": item.accountType,
      "description": item.description,
      "withdrawAmount": item.withdrawAmount,
      "withdrawCount": item.withdrawCount,
      "purchaseAmount": item.purchaseAmount,
      "purchaseCount": item.purchaseCount,
      "transferAmount": item.transferAmount,
      "transfereCount": item.transfereCount,
    });
  }

  clearfilter() {
    this.productObj = "";
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

}




