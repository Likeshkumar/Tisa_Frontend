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
  productCode: string;
  branchcode: string;
  cardNo: string;
  expdate: string;
  accountNo: string;
  customerId: string;
  customername: string;
  cardtype: string;
}



@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss'],
})

export class FeeComponent implements OnInit {

  paginator: MatPaginator;
  userName: string;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  displayedColumns: string[] = ['sno', 'productCode', 'feecode', 'feedesc', 'action'];
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
  feeForm: FormGroup;
  mode: any = 'L';
  productdata: any;
  userData: any;
  isCvvRequired: boolean | null = null;
  isCvvDisabled: boolean = false;
  schemeCode: any;
  acctTypeList: [];
  acctSubTypeList: [];
  cardtypeList: any;
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
    this.feeForm = this.fb.group({
      productCode: ['', Validators.required],
      typeofCard: ['', Validators.required],
      acctSubType: ['', Validators.required],
      schemeFlag: ['', Validators.required],
      schemeCode: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.minLength(3)]],
      schemeDescription: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(25)]],
      // repin: ['0', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      // damage: ['0', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      // reissue: ['0', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      // renewal: ['0', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      // newCard: ['0', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],

      periodicity: ['', Validators.required],
      rep_periodicity: ['', Validators.required],
      ren_periodicity: ['', Validators.required],
      repin_periodicity: ['', Validators.required],
      cardblock_periodicity: ['', Validators.required],
      cardunblock_periodicity: ['', Validators.required],
      secacc_periodicity: ['', Validators.required],
      close_periodicity: ['', Validators.required],
      resetpin_periodicity: ['', Validators.required],
      cardpemblock_periodicity: ['', Validators.required],

      newcardfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)],],
      newcardtax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      newtxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],

      replacementcardfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      replacementcardtax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      replacementtxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],

      renewalcardfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      renewalcardtax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      renewaltxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],


      repincardfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      repintax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      repintxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],


      cardblockfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      cardblocktax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      cardblocktxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],


      cardunblockfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      cardunblocktax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      cardunblocktxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],

      secaccountfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      secaccounttax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      secaccounttxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],

      carddesfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      carddestax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      carddestxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],

      resetpinfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      resetpintax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      resetpintxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],


      cardpemblockfee: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      cardpemblocktax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
      cardpemblocktxncode: ['', [Validators.required,Validators.pattern('^[A-Z]*$'), Validators.maxLength(3)]],

    });
  }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getFeeList();
    this.getProductData();
    this.getAccTypeList();
  }

  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
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

  gettypeofCard() {
    const reqData = {
      "instId": this.institutionId,
      "productCode": this.feeForm.value.productCode
    }
    let url = 'get/cardType';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.cardtypeList = res.cardtypeList;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Card type Details');
      }
    })
  }

  getAccTypeList() {
    this.spinner.show();
    this.rest.getwithHeader('accountsubType/get').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.acctSubTypeList = res.accountsubType;
        }
      });
  }

  getFeeList() {
    this.spinner.show();
    this.rest.getwithHeader('get/fee/get').subscribe(
      res => {
        if (res.respCode == "00") {
          this.spinner.hide();
          this.data = res.FeeList
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.data);
          }, 100);
        }
        else {
          this.spinner.hide();
          this.alerts.errorAlert("Fee List", "Unable to get Fee list");
        }
      });
  }

  addFeeList() {
    const data = this.feeForm.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'get/fee/edit'
    } else {
      url = 'get/fee/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.feeForm.reset();
            this.alerts.successAlert('Fee Details', res.respDesc);
            if (this.mode === 'E') {
              setTimeout(() => {
                this.backList();
                this.getFeeList();
              }, 1000);
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.backList();
              this.getFeeList();
            }
          } else {
            this.alerts.errorAlert('Fee Details', res.respDesc);
          }
        } else {
          this.alerts.errorAlert('Fee Details', res.respDesc);
        }

      })
    }
  }


  backList() {
    this.feeForm.reset();
    this.mode = 'L';
    this.feeForm.controls['productCode'].enable();
    this.feeForm.controls['acctSubType'].enable();
    this.feeForm.controls['schemeCode'].enable();
    this.getFeeList();
  }


  addFee(mode: any) {
    this.mode = mode;
  }

  clear() {
    this.feeForm.reset();
  }

  onRowClick(item: any, action: any) {
    this.mode = action;
    if (this.mode === "E") {
      this.feeForm.controls['productCode'].disable();
      this.feeForm.controls['acctSubType'].disable();
      this.feeForm.controls['schemeCode'].disable();
    } else {
      this.feeForm.controls['productCode'].enable();
      this.feeForm.controls['acctSubType'].enable();
      this.feeForm.controls['schemeCode'].enable();
    }

    this.feeForm.patchValue({
      productCode: item.productCode,
      typeofCard: item.typeofCard,
      acctSubType: item.acctSubType,
      schemeFlag: item.schemeFlag,
      schemeCode: item.schemeCode,
      schemeDescription: item.schemeDescription,

      periodicity: item.periodicity,
      rep_periodicity: item.rep_periodicity,
      ren_periodicity: item.ren_periodicity,
      repin_periodicity: item.repin_periodicity,
      cardblock_periodicity: item.cardblock_periodicity,
      cardunblock_periodicity: item.cardunblock_periodicity,
      secacc_periodicity: item.secacc_periodicity,
      close_periodicity: item.close_periodicity,
      resetpin_periodicity: item.resetpin_periodicity,
      cardpemblock_periodicity: item.cardpemblock_periodicity,
      
      newcardfee: item.newcardfee,
      newcardtax: item.newcardtax,
      newtxncode: item.newtxncode,

      replacementcardfee: item.replacementcardfee,
      replacementcardtax: item.replacementcardtax,
      replacementtxncode: item.replacementtxncode,

      renewalcardfee: item.renewalcardfee,
      renewalcardtax: item.renewalcardtax,
      renewaltxncode: item.renewaltxncode,

      repincardfee: item.repincardfee,
      repintax: item.repintax,
      repintxncode: item.repintxncode,

      cardblockfee: item.cardblockfee,
      cardblocktax: item.cardblocktax,
      cardblocktxncode: item.cardblocktxncode,

      cardunblockfee: item.cardunblockfee,
      cardunblocktax: item.cardunblocktax,
      cardunblocktxncode: item.cardunblocktxncode,

      secaccountfee: item.secaccountfee,
      secaccounttax: item.secaccounttax,
      secaccounttxncode: item.secaccounttxncode,

      carddesfee: item.carddesfee,
      carddestax: item.carddestax,
      carddestxncode: item.carddestxncode,

      resetpinfee: item.resetpinfee,
      resetpintax: item.resetpintax,
      resetpintxncode: item.resetpintxncode,

      cardpemblockfee: item.cardpemblockfee,
      cardpemblocktax: item.cardpemblocktax,
      cardpemblocktxncode: item.cardpemblocktxncode,
    });

    if (this.mode === 'V' || this.mode === 'E') {
      const reqData = {
        "instId": this.institutionId,
        "productCode": item.productCode
      }
      let url = 'get/cardType';
      this.rest.postValidate(reqData, url).subscribe((res: any) => {
        if (res.respCode == '00') {
          this.cardtypeList = res.cardtypeList;
        }
      });
    }
  }

  clearfilter() {
    this.productObj = "";
  }

  deleteFee(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to delete-" + item.schemeDescription + "!",
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
      "productCode": item.productCode,
      "username": item.username,
      "schemeCode": item.schemeCode

    }

    this.schemeCode = item.schemeCode;

    var url = "get/fee/delete" + this.schemeCode;

    this.rest.postValidate(deleteData, "get/fee/delete").subscribe((res: any) => {

      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert("Fee Details", res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getFeeList();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert("Fee Details", res.respDesc);
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





