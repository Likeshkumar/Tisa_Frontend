import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from 'app/services/rest.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  id: string;
  cardtype: string;
  carddesc: string;
  status: string;
}

@Component({
  selector: 'app-view-card-type',
  templateUrl: './view-card-type.component.html',
  styleUrls: ['./view-card-type.component.scss'],
  providers: [MatBottomSheet]
})


export class ViewCardTypeComponent implements OnInit {

  paginator: MatPaginator;
  userName: string;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  displayedColumns: string[] = ['sno', 'typeOfCard', 'description', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  filteredList1: any;
  filteredList2: any;
  productlist: any;
  binlist: any
  showrecords: boolean = false;
  productObj: any;
  institutionId: any;
  cardtypeList: any = [];
  cardtype: any;
  cardListdata: any;
  cardTypeFromGroup: FormGroup;
  CardDetailForm1: FormGroup;
  Insid: any;
  mode: any = 'L';
  cardList: any;
  userData: any;
  userInitiatedChange = false;
  typeOfCard: any;
  currencylist: any;

  constructor(
    public rest: RestService,
    public dialog: MatDialog,
    public alerts: NotificationService,
    public alertService: NotificationService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {
    this.userName = sessionStorage.getItem('Username');
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }


  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.InitForm();
    this.getList();
    this.getBin();
    this.getCurrency();
  }

  InitForm() {

    this.cardTypeFromGroup = this.fb.group({

      typeOfCard: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.pattern('^[0-9]*$')
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(25),
        Validators.pattern('^[a-zA-Z ]*$')
      ]),


      tsfMappingValue: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(4),
        Validators.pattern('^[0-9]*$')
      ]),

      productcode: new FormControl('', Validators.required),

      region: new FormControl('', Validators.required),

      currency: new FormControl('', Validators.required),

      cumMaxWdlAmt: new FormControl('', [
        Validators.required,
        Validators.maxLength(7),
        Validators.pattern('^[0-9]*$')
      ]),

      cumMaxWdlCnt: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern('^[0-9]*$')
      ])

    });
  }

  addCardType() {
    this.spinner.show();
    const data = this.cardTypeFromGroup.getRawValue();
    data.instId = this.institutionId;
    data.username = this.userData;
    let url = ''
    if (this.mode === 'E') {
      url = 'cardtype/edit'
    } else {
      url = 'cardtype/add'
    }
    if (url != '') {
      this.rest.postValidate(data, url).subscribe((res: any) => {
        if (res) {
          if (res.respCode == '00') {
            this.spinner.hide();
            this.cardTypeFromGroup.reset();
            this.alerts.successAlert('Card Type Details', res.respDesc);
            if (this.mode === 'E') {
              this.spinner.hide();
              this.backList();
              this.getList();
            } else if (this.mode === 'A' || this.mode === 'C') {
              this.spinner.hide();
              this.backList();
              this.getList();
            }
          } else {
            this.spinner.hide();
            this.alerts.errorAlert('Card Type Details', res.respDesc);
          }
        } else {
          this.spinner.hide();
          this.alerts.errorAlert('Card Type Details', res.respDesc);
        }

      })
    }
  }


  initTables(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

  backList() {
    this.cardTypeFromGroup.reset();
    this.mode = 'L';
    this.cardTypeFromGroup.controls['typeOfCard'].enable();
    this.cardTypeFromGroup.controls['productcode'].enable();
    this.getList();
  }

  clear() {
    this.cardTypeFromGroup.reset();
  }

  onRowClick(item: any, action: string): void {
    this.mode = action;

    if (this.mode === 'E') {
      this.cardTypeFromGroup.controls['typeOfCard'].disable();
      this.cardTypeFromGroup.controls['productcode'].disable();
    } else {
      this.cardTypeFromGroup.controls['typeOfCard'].enable();
      this.cardTypeFromGroup.controls['productcode'].enable();
    }

    this.cardTypeFromGroup.patchValue({
      typeOfCard: item.typeOfCard,
      description: item.description,
      tsfMappingValue: item.tsfMappingValue,
      productcode: item.productcode,
      region: item.region,
      currency: item.currency,
      instId: item.instId,
      username: item.username,
      cumMaxWdlAmt: item.cumMaxWdlAmt,
      cumMaxWdlCnt: item.cumMaxWdlCnt,
    });
  }


  clearfilter() {
    this.productObj = "";
  }

  getBin() {
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

  getCurrency() {
    let url = 'get/currency';
    this.rest.getwithHeader(url).subscribe(
      (res: any) => {
        if (res.respCode === '00') {
          this.spinner.hide();
          this.currencylist = res.currencyList;
        }
      },
    );
  }

  getList() {
    this.spinner.show();
    this.showrecords = true;
    let url = `cardtype/get`;
    this.rest.getwithHeader(url).subscribe((res: any) => {
      if (res) {
        if (res.respCode == '00') {
          this.spinner.hide();
          this.cardListdata = res.cardTypeList;
          this.showrecords = true;
          setTimeout(() => {
            this.initTables(this.cardListdata);
          }, 100);
        } else {
          this.spinner.hide();
          this.alerts.errorAlert('Card Type List', res.respDesc);
        }
      } else {
        this.spinner.hide();
        this.alerts.errorAlert('Card Type List', res.respDesc);
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

  clickAdd() {
    this.mode = 'A';
  }


  deleteCardType(item: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: "Do You want to delete-" + item.description + "!",
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
      "instId": item.instId,
      "typeOfCard": item.typeOfCard,
      "username": item.username,
      "productcode": item.productcode,
    }

    this.typeOfCard = item.cardType;

    var url = "cardtype/delete";

    this.rest.postValidate(deleteData, url).subscribe((res: any) => {

      if (res.respCode == "00") {
        this.spinner.hide();
        this.alertService.successAlert('Card Type List', res.respDesc);
        setTimeout(() => {
          this.backList();
          this.getList();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alertService.errorAlert('Card Type List', res.respDesc);
      }
    });
  }

}


