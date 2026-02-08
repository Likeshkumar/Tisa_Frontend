import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RestService } from 'app/services/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'app/services/notification.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-fee-report',
  templateUrl: './fee-report.component.html',
  styleUrls: ['./fee-report.component.scss'],
  providers: [DatePipe]
})
export class FeeReportComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  reportForm: FormGroup;
  reportMode: string = '';
  selectedOption: string = 'account';
  userInput: string = '';
  today: Date = new Date();
  minToDate: Date | null = null;
  institutionId: string;
  reportData: any[] = [];

  displayedColumns: string[] = [
    'customerName',
    'chnMask',
    'accountNo',
    'feeAmount',
    'feeTax',
    'feetxn',
    'debitDate',
    'debitReason',
    'failureDesc'
  ];

  showCardDetails: boolean = false;
  showrecords: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private alerts: NotificationService,
    private spinner: NgxSpinnerService,
    private rest: RestService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.institutionId = this.rest.readData('InstituteId');
  }

  initializeForm(): void {
    this.reportForm = new FormGroup({
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
    });
  }

  onModeChange(): void {
    this.resetForm();
    this.showCardDetails = false;
  }

  onSelectionChange(): void {
    this.userInput = '';
    this.showCardDetails = false;
  }

  onFromDateChange(): void {
    const fromDate = this.reportForm.get('fromDate')?.value;
    this.minToDate = fromDate ? new Date(fromDate) : null;

    const toDate = this.reportForm.get('toDate')?.value;
    if (toDate && fromDate && new Date(toDate) < new Date(fromDate)) {
      this.reportForm.get('toDate')?.setValue(null);
    }
  }

  isFormValid(): boolean {
    if (this.reportMode === 'single') {
      return this.selectedOption !== '' &&
        this.userInput !== '' &&
        this.userInput.length >= this.getMinLengthForSelection(this.selectedOption) &&
        this.userInput.length <= this.getMaxLengthForSelection(this.selectedOption) &&
        new RegExp(this.getPatternForSelection(this.selectedOption)).test(this.userInput);
    } else {
      return this.reportForm.valid;
    }
  }

  isExportAllowed(): boolean {
    if (this.reportMode === 'single') {
      return this.showCardDetails && this.dataSource.data.length > 0;
    } else {
      return this.reportForm.valid;
    }
  }

  getSingleRecordData() {
    if (!this.isFormValid()) return;

    this.spinner.show();
    const requestData = {
      instId: this.institutionId,
      cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
      accountNumber: this.selectedOption === 'account' ? this.userInput : null
    };

    this.rest.postValidate(requestData, 'report/feeReport/getSingle').subscribe(
      (res: any) => {
        this.spinner.hide();

        if (res.respCode === '00') {
          this.reportData = res.FeeDebitList || [];
          this.initTables(this.reportData);
          this.showCardDetails = true;
          this.showrecords = true;
        } else {
          this.alerts.errorAlert("Fee Report", res.respDesc);
          this.showCardDetails = false;
          this.showrecords = false;
          this.dataSource.data = [];
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.alerts.errorAlert("Fee Report", "An error occurred while fetching the data.");
        console.error('Error during fee report fetch:', error);
        this.showCardDetails = false;
        this.showrecords = false;
        this.dataSource.data = [];
      }
    );
  }

  initTables(data: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  exportReport(format: string) {
    this.spinner.show();
    
    if (this.reportMode === 'single') {
      if (!this.showCardDetails || this.dataSource.data.length === 0) {
        this.spinner.hide();
        this.alerts.errorAlert("Export Failed", "No data available to export");
        return;
      }

      const exportParams = {
        instId: this.institutionId,
        cardDetails: this.reportData,
        format: format
      };

      this.rest.postValidate3(exportParams, 'report/feeReport/SingleFeeReport', { responseType: 'blob' }).subscribe(
        (res: Blob) => {
          this.handleExportResponse(res, format);
        },
        (error) => {
          this.handleExportError(error);
        }
      );
    } else if (this.reportMode === 'multiple') {
      if (!this.reportForm.valid) {
        this.spinner.hide();
        this.alerts.errorAlert("Export Failed", "Please select valid date range");
        return;
      }

      const exportParams = {
        instId: this.institutionId,
        fromDate: this.datePipe.transform(this.reportForm.value.fromDate, 'dd-MM-yy'),
        toDate: this.datePipe.transform(this.reportForm.value.toDate, 'dd-MM-yy'),
        format: format
      };

      this.rest.postValidate3(exportParams, 'report/getMultipleReport', { responseType: 'blob' }).subscribe(
        (res: Blob) => {
          this.handleExportResponse(res, format);
        },
        (error) => {
          this.handleExportError(error);
        }
      );
    }
  }

  private handleExportResponse(res: Blob, format: string) {
    this.spinner.hide();
    const currentDateTime = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
    const fileName = `FeeReport_${currentDateTime}.${format}`;
    const blobType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([res], { type: blobType });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(link.href);
  }

  private handleExportError(error: any) {
    this.spinner.hide();
    this.alerts.errorAlert("Export Failed", "An error occurred while exporting the report.");
    console.error('Error exporting report:', error);
  }

  resetForm(): void {
    this.selectedOption = 'account';
    this.userInput = '';
    this.reportForm.reset();
    this.dataSource.data = [];
    this.showCardDetails = false;
    this.showrecords = false;
  }

  getLabelForSelection(option: string): string {
    return option === 'account' ? 'Enter the Account Number' : 'Enter the Card Number';
  }

  getPlaceholderForSelection(option: string): string {
    return option === 'account' ? 'Enter Account Number' : 'Enter Card Number';
  }

  getMinLengthForSelection(option: string): number {
    return option === 'account' ? 10 : 16;
  }

  getMaxLengthForSelection(option: string): number {
    return option === 'account' ? 16 : 19;
  }

  getPatternForSelection(option: string): string {
    return '^[0-9]*$';
  }

  getErrorMessage(inputModel: any, option: string): string {
    if (inputModel.errors?.required) {
      return `${this.getLabelForSelection(option)} is required`;
    }
    if (inputModel.errors?.minlength) {
      return `${this.getLabelForSelection(option)} must be at least ${this.getMinLengthForSelection(option)} digits`;
    }
    if (inputModel.errors?.maxlength) {
      return `${this.getLabelForSelection(option)} cannot exceed ${this.getMaxLengthForSelection(option)} digits`;
    }
    if (inputModel.errors?.pattern) {
      return `${this.getLabelForSelection(option)} must contain only numbers`;
    }
    return '';
  }
}