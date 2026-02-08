import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-renewal-report',
  templateUrl: './renewal-report.component.html',
  styleUrls: ['./renewal-report.component.scss'],
  providers: [DatePipe]
})

export class RenewalReportComponent implements OnInit {

  productlist: any;
  branchlist: any;
  firstFormGroup: FormGroup;
  myDate: any;
  fromDate: Date;
  toDate: Date;
  today: Date = new Date();

  constructor(
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    this.firstFormGroup = new FormGroup({
      productcode: new FormControl('', [Validators.required]),
      branchcode: new FormControl('', [Validators.required]),
      subtype: new FormControl('', [Validators.required]),
      fromdate: new FormControl('', [Validators.required, pastDateValidator]),
      todate: new FormControl('', [Validators.required, pastDateValidator]),
      process: new FormControl('', [Validators.required]),
      action: new FormControl('', [Validators.required]),
    });

    //this.productlist = this.productdata.getProductData();
    //this.branchlist = this.branchdata.getBranchData();
    this.myDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  }

  // downloadPDF() {
  //   const doc = new jsPDF();
  //   doc.text('Card Process Report', 20, 20);
  //   doc.text(`Date: ${this.myDate}`, 20, 30);
  //   doc.text(`Product Code: ${this.firstFormGroup.get('productcode')?.value}`, 20, 40);
  //   doc.text(`Branch Code: ${this.firstFormGroup.get('branchcode')?.value}`, 20, 50);
  //   doc.save('card_process_report.pdf');
  //   this.firstFormGroup.reset();
  // }

  // downloadExcel() {
  //   const reportData = [
  //     {
  //       ProductCode: this.firstFormGroup.get('productcode')?.value,
  //       BranchCode: this.firstFormGroup.get('branchcode')?.value,
  //       FromDate: this.firstFormGroup.get('fromdate')?.value,
  //       ToDate: this.firstFormGroup.get('todate')?.value,
  //       Process: this.firstFormGroup.get('process')?.value,
  //       Action: this.firstFormGroup.get('action')?.value,
  //     }
  //   ];

  //   const worksheet = XLSX.utils.json_to_sheet(reportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Process Report');

  //   // Generate the Excel file
  //   XLSX.writeFile(workbook, 'process_report.xlsx');
  //   this.firstFormGroup.reset();
  // }
}

const pastDateValidator: ValidatorFn = (control: AbstractControl) => {
  const selectedDate = new Date(control.value);
  const today = new Date();
  return selectedDate > today ? { 'invalidDate': true } : null;
};






