import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'app/services/rest.service';

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
  selector: 'app-pin-mailer',
  templateUrl: './pin-mailer.component.html',
  styleUrls: ['./pin-mailer.component.scss'],
  providers: [MatBottomSheet, MatButtonModule]
})

export class PinMailerComponent implements OnInit {

  labelName: any;
  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  displayedColumns: string[] = ['binNo', 'bindesc', 'chnlength', 'attachcardtype', 'hsm', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data = [];
  columns: any = [];
  optionsWithFeatures: any;
  showrecords: boolean = false;
  pinMailerForm: FormGroup;
  institutionId: any;
  userData: any;

  constructor(private _bottomSheet: MatBottomSheet,
    public alerts: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder,
    public rest: RestService) { }

  ngOnInit(): void {


    this.formInt();
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.optionsWithFeatures = {
      rowClickEvent: true,
      rowPerPageMenu: [5, 10, 20, 30],
      rowPerPage: 5
    }
    this.showrecords = true;

    this.data = [{
      id: '758974',
      desc: 'Proprietrary bin',
      chnlength: '16',
      attachcardtype: 'Card Type',
      branch: 'Head office',
      hsm: 'Thales',

    },
    {
      id: '454595',
      desc: 'Visa Network',
      chnlength: '16',
      attachcardtype: 'Card Type',
      branch: 'Tambaram main branch',
      hsm: 'Thales',

    },
    {
      id: '589698',
      desc: 'Master Card',
      chnlength: '19',
      attachcardtype: 'Card Type',
      branch: 'ECR',
      hsm: 'Thales',

    }]
    this.dataSource = new MatTableDataSource(this.data);
  }

  formInt() {
    this.pinMailerForm = this.formBuilder.group({
      chnPrint: ['', Validators.required],
      chnLength: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      chnLine: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      chnColumn: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      customerNamePrint: ['', Validators.required],
      customerNameLength: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      customerNameLine: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      customerNameColumn: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      address1Print: ['', Validators.required],
      address1Length: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      address1Line: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address1Column: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      pinPrint: ['', Validators.required],
      pinLength: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      pinLine: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      pinColumn: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      numToWordsPrint: ['', Validators.required],
      numToWordsLength: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      numToWordsLine: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      numToWordsColumn: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      mobilePhonePrint: ['', Validators.required],
      mobilePhoneLength: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      mobilePhoneLine: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      mobilePhoneColumn: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

      acctNumberPrint: ['', Validators.required],
      acctNumberLength: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      acctNumberLine: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      acctNumberColumn: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

    })
  }


  addPinMailer() {
    let postData = {

      "instId": this.institutionId,
      "username": this.rest.readData('Username'),

      "chnPrint": this.pinMailerForm.value.chnPrint,
      "chnLength": this.pinMailerForm.value.chnLength,
      "chnLine": this.pinMailerForm.value.chnLine,
      "chnColumn": this.pinMailerForm.value.chnColumn,

      "customerNamePrint": this.pinMailerForm.value.customerNamePrint,
      "customerNameLength": this.pinMailerForm.value.customerNameLength,
      "customerNameLine": this.pinMailerForm.value.customerNameLine,
      "customerNameColumn": this.pinMailerForm.value.customerNameColumn,

      "address1Print": this.pinMailerForm.value.address1Print,
      "address1Length": this.pinMailerForm.value.address1Length,
      "address1Line": this.pinMailerForm.value.address1Line,
      "address1Column": this.pinMailerForm.value.address1Column,

      "pinPrint": this.pinMailerForm.value.pinPrint,
      "pinLength": this.pinMailerForm.value.pinLength,
      "pinLine": this.pinMailerForm.value.pinLine,
      "pinColumn": this.pinMailerForm.value.pinColumn,

      "numToWordsPrint": this.pinMailerForm.value.numToWordsPrint,
      "numToWordsLength": this.pinMailerForm.value.numToWordsLength,
      "numToWordsLine": this.pinMailerForm.value.numToWordsLine,
      "numToWordsColumn": this.pinMailerForm.value.numToWordsColumn,

      "mobilePhonePrint": this.pinMailerForm.value.mobilePhonePrint,
      "mobilePhoneLength": this.pinMailerForm.value.mobilePhoneLength,
      "mobilePhoneLine": this.pinMailerForm.value.mobilePhoneLine,
      "mobilePhoneColumn": this.pinMailerForm.value.mobilePhoneColumn,

      "acctNumberPrint": this.pinMailerForm.value.acctNumberPrint,
      "acctNumberLength": this.pinMailerForm.value.acctNumberLength,
      "acctNumberLine": this.pinMailerForm.value.acctNumberLine,
      "acctNumberColumn": this.pinMailerForm.value.acctNumberColumn
    }

    let url = 'addPinMailer/add';
    this.rest.postValidate(postData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.dataSource.data = res.authList;
        this.alerts.successAlert("PinMailer Configuration Added", res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
          this.pinMailerForm.reset();
        }, 3000);
      } else {
        this.alerts.errorAlert("Add PinMailer", res.respDesc);
      }
    });
  }


  // onRowClick(item: any) {
  //   this.openBottomSheet(item);
  // }

  tabClick(event) {
    this.labelName = event.tab.textLabel;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // openBottomSheet(item) {

  //   this._bottomSheet.open(BottomSheetOverviewExampleSheet, {
  //     data: { item },
  //   });
  // }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}



// @Component({
//   selector: 'pinMailer-list-sheet',
//   templateUrl: 'pinMailer-list-sheet.html',
// })
// export class BottomSheetOverviewExampleSheet {
//   constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { binNo: String, bindesc: any }, private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>) { }

//   openLink(event: MouseEvent): void {
//     this._bottomSheetRef.dismiss();
//     event.preventDefault();
//   }
// }