import { Component } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-non-issused-report',
  templateUrl: './non-issused-report.component.html',
  styleUrls: ['./non-issused-report.component.scss'],
  providers: [DatePipe]
})

export class NonIssusedReportComponent {
  productlist: any;
  branchlist: any;
  institutionId: string;
  reportFormGroup: FormGroup
  fromDate: Date;
  toDate: Date;
  today: Date = new Date();
  minToDate: Date | null = null;

  constructor(
    public rest: RestService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.productlist = this.getProductData();
    this.branchlist = this.getBranchData();
    this.reportFormGroup = new FormGroup({
      productCode: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      process: new FormControl('', [Validators.required]),
      action: new FormControl('', [Validators.required]),
    });
  }
  onFromDateChange(): void {
    const fromDate = this.reportFormGroup.get('fromDate')?.value;
    this.minToDate = fromDate ? new Date(fromDate) : null;

    // Reset To Date if it is earlier than the new From Date
    const toDate = this.reportFormGroup.get('toDate')?.value;
    if (toDate && fromDate && new Date(toDate) < new Date(fromDate)) {
      this.reportFormGroup.get('toDate')?.setValue(null);
    }
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

  getBranchData() {
    const reqData = {
      "instId": this.institutionId,
    }
    let url = 'get/branch';
    this.rest.postValidate(reqData, url).subscribe((res: any) => {
      if (res.respCode == '00') {
        this.branchlist = res.branchList;
      }
    })
  }


  encrypt(format: string) {
    const postData = {
      instId: this.institutionId,
      productCode: this.reportFormGroup.value.productCode,
      branchCode: this.reportFormGroup.value.branchCode,
      fromDate: this.datePipe.transform(this.reportFormGroup.value.fromDate, 'dd-MM-yy'),
      toDate: this.datePipe.transform(this.reportFormGroup.value.toDate, 'dd-MM-yy'),
      process: this.reportFormGroup.value.process,
      action: this.reportFormGroup.value.action,
      format: format
    };

    let url = 'report/processReport';

    this.rest.postValidate3(postData, url, { responseType: 'blob' }).subscribe((res: Blob) => {
      const currentDateTime = this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss');
      const fileName = `NonIssusedCardReport_${currentDateTime}.${format}`;
      const blobType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([res], { type: blobType });

      // Create a link to download the file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      // Clean up
      window.URL.revokeObjectURL(link.href);
      this.reportFormGroup.reset();
    }, error => {
      console.error('Error downloading the report:', error);
    });
  }




}


