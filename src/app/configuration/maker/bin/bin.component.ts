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
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class BinComponent implements OnInit {
  paginator: MatPaginator;
  userName: string;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  displayedColumns: string[] = ['sno', 'binCode', 'binDescription', 'action'];
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
  binDetailForm: FormGroup;
  mode: any = 'L';
  productdata: any;
  userData: any;
  isCvvRequired: boolean | null = null;
  isCvvDisabled: boolean = false;
  binCode: any;

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
    this.binDetailForm = this.fb.group({
      binCode: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]{6}$"),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]),
      binDescription: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]*$"),
        Validators.maxLength(25)
      ]),
      binType: new FormControl('', Validators.required),
      pinMethod: new FormControl(''),
      chnLength: new FormControl('', Validators.required),
      expiryMonth: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(2),
        Validators.min(1)
      ]),
      cardGeneration: new FormControl('', Validators.required),
      serviceCode: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(3),
        Validators.maxLength(3)
      ]),
      cardCategory: new FormControl('', Validators.required),
      cvvRequired: new FormControl('yes', Validators.required),
    })
  }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getBinList();
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  onCardCategoryChange(cardCategory: string): void {
    if (cardCategory === 'CC') {
      this.isCvvRequired = true;       // Make sure isCvvRequired is properly updated
      this.isCvvDisabled = true;       // Disable the CVV field
      this.binDetailForm.controls['cvvRequired'].setValue('yes');  // Set default value for CVV
    } else if (cardCategory === 'MS') {
      this.isCvvRequired = true;       // Set CVV required to true
      this.isCvvDisabled = false;      // Enable the CVV field
      this.binDetailForm.controls['cvvRequired'].setValue('no');   // Set default value for CVV
    }
  }

  getBinList() {
    this.spinner.show();
    this.rest.getwithHeader('bin/get').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.binListdata = res.binList
          this.initTables(this.binListdata);
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.binListdata);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Bin List", "Unable to get bin list");
        }
      });
  }

  AddBin() {
    const data = this.binDetailForm.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'bin/edit'
    } else {
      url = 'bin/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.binDetailForm.reset();
            this.alerts.successAlert('Bin Details', res.respDesc);
            if (this.mode === 'E') {
              setTimeout(() => {
                this.backList();
                this.getBinList();
              }, 1000);
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.backList();
              this.getBinList();
            }
          } else {
            this.alerts.errorAlert('Bin Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('Bin Details', res.respDesc);
        }

      })
    }
  }


  backList() {
    this.binDetailForm.reset();
    this.mode = 'L';
    this.binDetailForm.controls['binCode'].enable();
    this.getBinList();
  }


  addBin(mode: any) {
    this.mode = mode;
  }

  clear() {
    this.binDetailForm.reset();
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    if (this.mode === "E") {
      this.binDetailForm.controls['binCode'].disable()
    } else {
      this.binDetailForm.controls['binCode'].enable()
    }

    this.binDetailForm.patchValue({
      "instId": item.instId,
      "username": item.username,
      "binCode": item.binCode,
      "binDescription": item.binDescription,
      "binType": item.binType,
      "pinMethod": item.pinMethod,
      "chnLength": item.chnLength,
      "expiryMonth": item.expiry,
      "cardGeneration": item.cardGen,
      "serviceCode": item.serviceCode,
      "cardCategory": item.cardCategory,
      "cvvRequired": item.cvvRequired,

    });
  }

  clearfilter() {
    this.productObj = "";
  }

  deleteBin(item: any) {
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
        this.alertService.successAlert('Bin Details', res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getBinList();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert('Bin Details', res.respDesc);
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



