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
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class InstitutionComponent implements OnInit {

  paginator: MatPaginator;
  userName: string;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  displayedColumns: string[] = ['institutionName', 'institutionDescription', 'action'];
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
  InstitutionForm: FormGroup;
  mode: any = 'L';
  productdata: any;
  userData: any;
  isCvvRequired: boolean | null = null;
  isCvvDisabled: boolean = false;
  binCode: any;
  institutionList: any = [];

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
    this.InstitutionForm = this.fb.group({
      institutionName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(12), Validators.minLength(2)]],
      institutionDescription: ['', [Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(35), Validators.minLength(4)]],
      accountLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(2)]],
      branchCodeLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(2)]],
      accountTypeLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(2)]],
      // AccountProductCodeLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4), Validators.minLength(2)]],
      accountSubTypeLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4), Validators.minLength(2)]],
      accountSerialNumberCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1)]],
      padding: [''],
      customerIDLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1)]],
      customerIDBasedon: [''],
      eftSwitch: [''],
      cardTypeLength: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(2)]],
      addressline1: ['', [Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]],
      addressline2: ['', [Validators.maxLength(24), Validators.pattern("^[a-zA-Z0-9 ,.-]*$")]],
      city: ['', ''],
      state: ['', ''],
      pincode: ['', ''],
      country: ['', ''],
      mobNo: [''],
    })
  }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getInstitution();
  }

  getInstitution() {
    this.spinner.show();
    this.rest.getwithHeader('institution/get').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.institutionList = res.InstitutionList;
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.institutionList);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Institution List", "Unable to get Institution list");
        }
      });
  }

  initTables(institutionList: any) {
    this.dataSource = new MatTableDataSource<PeriodicElement>(institutionList);
    this.dataSource.paginator = this.paginator;
  }

  addInstitution() {
    const data = this.InstitutionForm.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'institution/edit'
    } else {
      url = 'institution/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.InstitutionForm.reset();
            this.alerts.successAlert('Institution Details', res.respDesc);
            if (this.mode === 'E') {
              setTimeout(() => {
                this.backList();
                this.getInstitution();
              }, 1000);
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.backList();
              this.getInstitution();
            }
          } else {
            this.alerts.errorAlert('Institution Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('Institution Details', res.respDesc);
        }

      })
    }
  }


  backList() {
    this.InstitutionForm.reset();
    this.mode = 'L';
    this.InstitutionForm.controls['binCode'].enable();
    this.getInstitution();
  }


  addInst(mode: any) {
    this.mode = mode;
  }

  clear() {
    this.InstitutionForm.reset();
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    this.InstitutionForm.patchValue({
      "institutionName": item.institutionName,
      "username": this.rest.readData('Username'),
      "institutionDescription": item.institutionDescription,
      "accountLength": item.accountLength,
      "branchCodeLength": item.branchCodeLength,
      "accountTypeLength": item.accountTypeLength,
      "accountSubTypeLength": item.accountSubTypeLength,
      //"acctProdCodeLen": item.AccountProductCodeLength,
      "accountSerialNumberCode": item.accountSerialNumberCode,
      "padding": item.padding,
      "customerIDLength": item.customerIDLength,
      "customerIDBasedon": item.customerIDBasedon,
      "eftSwitch": item.eftSwitch,
      "cardTypeLength": item.cardTypeLength,
      "addressline1": item.addressline1,
      "addressline2": item.addressline2,
      "city": item.city,
      "state": item.state,
      "pincode": item.pincode,
      "country": item.country,
      "mobNo": item.mobNo

    });
  }

  clearfilter() {
    this.productObj = "";
  }

  deleteInstitution(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to delete-" + item.binDescription + "!",
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
      "binCode": item.binCode

    }

    this.binCode = item.binCode;

    var url = "bin/delete" + this.binCode;
    this.rest.postValidate(deleteData, "bin/delete").subscribe((res: any) => {
      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert('Institution Details', res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getInstitution();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert('Institution Details', res.respDesc);
      }
    });
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







