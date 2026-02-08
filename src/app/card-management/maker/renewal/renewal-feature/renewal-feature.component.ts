import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RestService } from 'app/services/rest.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'app/services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';

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
  selector: 'app-renewal-feature',
  templateUrl: './renewal-feature.component.html',
  styleUrls: ['./renewal-feature.component.scss'],
  providers: [DatePipe]
})

export class RenewalFeatureComponent {

  displayedColumns: string[] = ['select', 'productcode', 'branchcode', 'chnMask', 'acctno', 'expDate', 'customerId', 'embName', 'mobileNo'];
  renewalForm!: FormGroup;
  productlist: any[] = [];
  branchList: any[] = [];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<PeriodicElement>(true, []);
  institutionId: string = '';
  userData: string = '';
  showrecords = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedMode: string = '';
  searchBy: string = 'customerId';
  searchValue: string = '';
  productObj: any;
  branchObj: any;

  
  selectDate: Date = new Date(2029, 9); 
  selectedYear: number = this.selectDate.getFullYear();

  constructor(
    public rest: RestService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    public alerts: NotificationService
  ) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.userData = this.rest.readData('Username');
    this.getProductData();
    this.getBranchData();
    this.initializeForm();
  }

  initializeForm(): void {
    this.renewalForm = this.fb.group({
      selectedMode: [''],
      searchBy: ['customerId'],
      eligibility: ['', Validators.required],
      searchValue: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      productObj: [null, Validators.required],
      branchObj: [null, Validators.required]
    });
  }

  // get selectedEligibility() {
  //   return this.renewalForm.get('eligibility')?.value;
  // }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }



  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  getPageData() {
    return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  masterToggle(checkboxChange: MatCheckboxChange) {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }

  checkboxLabel(row): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  isFilterValid(): boolean {
    if (this.selectedMode === 'single') {
      return !!this.searchValue && !!this.searchBy;
    } else if (this.selectedMode === 'multiple') {
      return !!this.productObj && !!this.branchObj;
    }
    return false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isSelectedPage() {

    const numSelected = this.selection.selected.length;
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;

    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }

    return numSelected === endIndex;
  }

  getFilterRecordList(): void {
    const mode = this.renewalForm.get('selectedMode')?.value;

    if (mode === 'single') {
      this.retrieveSingleRecord();
    } else if (mode === 'multiple') {
      this.retrieveMultipleRecords();
    }
  }

  retrieveSingleRecord(): void {
    this.spinner.show();
    const searchBy = this.renewalForm.get('searchBy')?.value;
    const value = this.renewalForm.get('searchValue')?.value;

    const requestData = {
      customerId: searchBy === 'customerId' ? value : null,
      cardNumber: searchBy === 'cardNumber' ? value : null,
      eligibility: this.renewalForm.value.eligibility,
      instId: this.institutionId
    };

    this.rest.postValidate(requestData, 'nfc/maintenance/renewal/card').subscribe((res: any) => {
      if (res.respCode === '00') {
        this.spinner.hide();
        this.dataSource.data = res.CardDetails ? res.CardDetails : [];
        this.showrecords = true;
      } else {
        this.spinner.hide();
        this.dataSource.data = [];
        this.showrecords = false;
        this.alerts.errorAlert("Card Renewal Management", res.respDesc);
      }
    });
  }

  retrieveMultipleRecords(): void {
    this.spinner.show();
    const requestData = {
      productCode: this.renewalForm.get('productObj')?.value?.productCode,
      branchCode: this.renewalForm.get('branchObj')?.value?.branchCode,
      eligibility: this.renewalForm.value.eligibility,
      instId: this.institutionId
    };

    this.rest.postValidate(requestData, 'nfc/maintenance/renewal/Allcard').subscribe((res: any) => {
      if (res.respCode === '00') {
        this.spinner.hide();
        this.dataSource.data = res.CardDetails ? res.CardDetails : [];
        this.showrecords = true;
      } else {
        this.spinner.hide();
        this.dataSource.data = [];
        this.showrecords = false;
        this.alerts.errorAlert("Card Renewal Management", res.respDesc);
      }
    });
  }


  generateprefile(action: 'opted' | 'notOpted'): void {
    this.spinner.show();

    if (this.selection.selected.length === 0) {
      this.spinner.hide();
      this.alerts.showAlert("Card Renewal Management", "Please select at least one record.");
      return;
    }

    const requestData = {
      instId: this.institutionId,
      username: this.userData,
      action: action === 'opted' ? 'REQUIRED' : 'NOT_REQUIRED',
      cardDetails: this.selection.selected
    };

    //   // Submit requestData here...
    //   this.spinner.hide();
    // }



    // generateprefile(action: 'opted' | 'notOpted'): void {

    //   this.spinner.show();
    //   if (this.dataSource.data.length === 0) {
    //     this.spinner.hide();
    //     this.alerts.showAlert("Card Renewal Management", "Please select the record");
    //     return;
    //   }

    //   const requestData = {
    //     instId: this.institutionId,
    //     username: this.userData,
    //     action: action === 'opted' ? 'REQUIRED' : 'NOT_REQUIRED',
    //     cardDetails: this.dataSource.data
    //   };

    this.rest.postValidate(requestData, 'nfc/maintenance/renewal/addAllcard').subscribe((res: any) => {
      if (res.respCode === '00') {
        this.spinner.hide();
        this.alerts.successAlert("Card Renewal Management", res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alerts.errorAlert("Card Renewal Management", res.respDesc);
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  getProductData(): void {
    const postdata = { instId: this.institutionId };
    this.rest.postValidate(postdata, 'get/product').subscribe((res: any) => {
      if (res.respCode === '00') {
        this.productlist = res.productList;
      }
    });
  }

  getBranchData(): void {
    const reqData = { instId: this.institutionId };
    this.rest.postValidate(reqData, 'get/branch').subscribe((res: any) => {
      if (res.respCode === '00') {
        this.branchList = res.branchList;
      } else {
        this.alerts.errorAlert(res.respDesc, 'Error while getting Branch Details');
      }
    });
  }

  onModeChange(): void {
    const mode = this.renewalForm.get('selectedMode')?.value;
    this.renewalForm.reset({
      selectedMode: mode,
      searchBy: 'customerId',
      searchValue: '',
      productObj: null,
      branchObj: null
    });

    this.showrecords = false;
    this.dataSource.data = [];

    if (mode === 'single') {
      this.renewalForm.get('searchValue')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]);
      this.renewalForm.get('productObj')?.clearValidators();
      this.renewalForm.get('branchObj')?.clearValidators();
    } else {
      this.renewalForm.get('searchValue')?.clearValidators();
      this.renewalForm.get('productObj')?.setValidators([Validators.required]);
      this.renewalForm.get('branchObj')?.setValidators([Validators.required]);
    }

    this.renewalForm.get('searchValue')?.updateValueAndValidity();
    this.renewalForm.get('productObj')?.updateValueAndValidity();
    this.renewalForm.get('branchObj')?.updateValueAndValidity();
  }

  clearForm(): void {
    this.searchValue = '';
    this.searchBy = 'customerId';
    this.productObj = null;
    this.branchObj = null;
  }

  updateValidators(): void {
    const control = this.renewalForm.get('searchValue');
    const searchBy = this.renewalForm.get('searchBy')?.value;

    if (searchBy === 'customerId') {
      control?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    } else {
      control?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
    }

    control?.updateValueAndValidity();
  }

  onSearchByChange(): void {
    const control = this.renewalForm.get('searchValue');
    const searchBy = this.renewalForm.get('searchBy')?.value;

    control?.reset();

    if (searchBy === 'customerId') {
      this.showrecords = false;
      control?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    } else {
      this.showrecords = false;
      control?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
    }

    control?.updateValueAndValidity();
  }

  cancelcvvgenerate() {
    this.selection.clear();
  }

  change() {
    this.dataSource.data = [];
    this.showrecords = false;
  }


  formatDate(date: Date): string {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const dates = `${month}/${year}`;
    return dates;
  }

  setYear(normalizedYear: Date): void {
    this.selectedYear = normalizedYear.getFullYear();
  }

  setMonth(normalizedMonth: Date, datepicker: MatDatepicker<Date>): void {
    const month = normalizedMonth.getMonth();
    this.selectDate = new Date(this.selectedYear, month, 1);
    datepicker.close();
  }
}

