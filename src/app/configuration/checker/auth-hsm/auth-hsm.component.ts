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
  selector: 'app-auth-hsm',
  templateUrl: './auth-hsm.component.html',
  styleUrls: ['./auth-hsm.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class AuthHsmComponent implements OnInit {

  paginator: MatPaginator;
  userName: string;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  displayedColumns: string[] = ['sno', 'productCode', 'hsmName', 'hsmcomId', 'action'];
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
  hsmListdata: any;
  hsmform: FormGroup;
  mode: any = 'L';
  productdata: any;
  userData: any;
  isCvvRequired: boolean | null = null;
  isCvvDisabled: boolean = false;
  productCode: any;

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
  }

  InitForm() {
    this.hsmform = this.fb.group({
      hsmName: ['', [Validators.required, Validators.maxLength(24), Validators.minLength(4), Validators.pattern("^[a-zA-Z]*$")]],
      decimilisation: ['', Validators.pattern("^[0-9]*$")],
      productCode: ['', Validators.required],
      messageHeader: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      pinlength: ['', Validators.pattern("^[0-9]*$")],
      pinOffsetLength: ['', Validators.pattern("^[0-9]*$")],
      pinMailerDesc: ['', [Validators.maxLength(25), Validators.pattern("^[a-zA-Z]*$")]],
      mailHeight: ['', Validators.pattern("^[0-9]*$")],
      ip: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
      panOffsetLength: ['', Validators.pattern("^[0-9]*$")],
      pvk1: ['', [Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(16), Validators.maxLength(48)]],
      cvk1: ['', [Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(16), Validators.maxLength(48)]],
      panPadChar: ['', Validators.pattern('^[a-zA-Z]*$')],
      mailLength: ['', Validators.pattern("^[0-9]*$")],
      port: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(4), Validators.pattern("^[0-9]*$")]],
      panValLength: ['', Validators.pattern("^[0-9]*$")],
      pvk2: ['', [Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(16), Validators.maxLength(48)]],
      cvk2: ['', [Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(16), Validators.maxLength(48)]]
    })
  }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getHSMList();
    this.getProductData();
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  getHSMList() {
    this.spinner.show();
    this.rest.getwithHeader('hsm/getAuthlist').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.hsmListdata = res.hsmListdata
          this.initTables(this.hsmListdata);
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.hsmListdata);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("HSM List", "Unable to get HSM list");
        }
      });
  }

  getProductData() {

    const postdata = {
      "instId": this.institutionId,
    };

    const url = 'get/product';
    this.rest.postValidate(postdata, url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.productlist = res.productList;
        }
      }
    );
  }

  AuthorizeHSM() {
    const data = this.hsmform.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'Auth') {
      url = 'hsm/addAuthorize'
    } 
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.hsmform.reset();
            this.alerts.successAlert('HSM Details', res.respDesc);
            if (this.mode === 'Auth') {
              setTimeout(() => {
                this.backList();
                this.getHSMList();
              }, 1000);
            } 
          } else {
            this.alerts.errorAlert('HSM Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('HSM Details', res.respDesc);
        }

      })
    }
  }

  rejectHSM() {
    const data = this.hsmform.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'Auth') {
      url = 'hsm/reject'
    } 
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.hsmform.reset();
            this.alerts.successAlert('HSM Details', res.respDesc);
            if (this.mode === 'Auth') {
              setTimeout(() => {
                this.backList();
                this.getHSMList();
              }, 1000);
            } 
          } else {
            this.alerts.errorAlert('HSM Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('HSM Details', res.respDesc);
        }

      })
    }
  }

  backList() {
    this.hsmform.reset();
    this.mode = 'L';
    this.hsmform.controls['productCode'].enable();
    this.getHSMList();
  }

  clear() {
    this.hsmform.reset();
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    this.hsmform.patchValue({
      instId: item.instId,
      username: item.username,
      hsmName: item.hsmName,
      decimilisation: item.decimilisation,
      productCode: item.productCode,
      messageHeader: item.messageHeader,
      pinlength: item.pinlength,
      pinOffsetLength: item.pinOffsetLength,
      pinMailerDesc: item.pinMailerDesc,
      mailHeight: item.mailHeight,
      ip: item.ip,
      panOffsetLength: item.panOffsetLength,
      pvk1: item.pvk1,
      cvk1: item.cvk1,
      panPadChar: item.panPadChar,
      mailLength: item.mailLength,
      port: item.port,
      panValLength: item.panValLength,
      pvk2: item.pvk2,
      cvk2: item.cvk2,
    });
  
    Object.keys(this.hsmform.controls).forEach(field => {
      const control = this.hsmform.get(field);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
      }
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

}





