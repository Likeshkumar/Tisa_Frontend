import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';

interface CardDetails {
  chnMask: string;
  embName: string;
  customerId: string;
}

@Component({
  selector: 'app-instant-card-name-print',
  templateUrl: './instant-card-name-print.component.html',
  styleUrls: ['./instant-card-name-print.component.scss']
})
export class InstantCardNamePrintComponent implements OnInit, AfterViewInit {
  @ViewChild('alignmentDialog') alignmentDialogTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['chnMask', 'embName', 'customerId'];
  dataSource = new MatTableDataSource<CardDetails>();

  data: CardDetails[] = [];
  institutionId: string = '';
  userData: string = '';
  showCardDetails = false;
  selectedOption = 'cardNumber';
  userInput = '';

  selectedCard: CardDetails | null = null;
  previewName = 'CUSTOMER NAME';

  xOffset = 0;
  yOffset = 0;
  fontSize = 20; // default font size (will not be used in printCard anymore)
  fontColor = '#000000';

  constructor(
    private spinner: NgxSpinnerService,
    private rest: RestService,
    private alerts: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId') || '';
    this.userData = this.rest.readData('Username') || '';
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onSelectionChange(): void {
    this.resetForm();
  }

  getLabelForSelection(): string {
    return 'Enter the Card Number';
  }

  getPlaceholderForSelection(): string {
    return 'Enter Card Number';
  }

  getErrorMessage(inputModel: any): string {
    if (inputModel.errors?.required) {
      return 'Card Number is required';
    }
    if (inputModel.errors?.minlength || inputModel.errors?.maxlength) {
      return 'Card Number must be 16 digits';
    }
    if (inputModel.errors?.pattern) {
      return 'Must contain only numbers';
    }
    return '';
  }

  getFilterRecordList() {
    if (!this.userInput || this.userInput.length !== 16) {
      this.alerts.errorAlert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    this.spinner.show();
    const postData = {
      cardNumber: this.userInput,
      instId: this.institutionId,
    };

    this.rest.postValidate(postData, 'cardmaintain/list').subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.respCode === '00') {
          this.data = res.cardMaintenanceList?.map((item: any) => item.cardDetails) || [];
          this.dataSource.data = this.data;
          this.showCardDetails = true;

          if (this.data.length > 0) {
            this.selectedCard = this.data[0];
            this.previewName = (this.selectedCard.embName || 'CUSTOMER NAME').trim();
          }
        } else {
          this.alerts.errorAlert('Error', res.respDesc || 'Failed to retrieve card details');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.alerts.errorAlert('Error', 'Failed to retrieve card details');
        console.error('Error:', err);
      }
    });
  }

  openAlignmentDialog() {
    if (this.data.length === 0) {
      this.alerts.errorAlert('Error', 'No card data available');
      return;
    }

    this.selectedCard = this.data[0];
    this.previewName = (this.selectedCard.embName || 'CUSTOMER NAME').trim();

    this.dialog.open(this.alignmentDialogTemplate, {
      width: '800px',
      disableClose: true
    });
  }

  saveAlignment() {
    const alignmentSettings = {
      xOffset: this.xOffset,
      yOffset: this.yOffset,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      lastUpdated: new Date(),
      updatedBy: this.userData
    };

    this.alerts.successAlert('Success', 'Alignment settings saved successfully');
  }

  printCard() {
    if (!this.selectedCard || !this.selectedCard.embName) {
      this.alerts.errorAlert('Error', 'No customer name available for printing.');
      return;
    }

    this.spinner.show();

    const printFrame = document.createElement('iframe');
    printFrame.style.cssText = `
      position: absolute;
      width: 0;
      height: 0;
      top: -9999px;
      left: -9999px;
      border: none;
    `;
    document.body.appendChild(printFrame);

    const iframeDoc = printFrame.contentWindow?.document;
    if (!iframeDoc) {
      this.alerts.errorAlert('Error', 'Could not access iframe document for printing.');
      this.spinner.hide();
      return;
    }

    const embossFontFamily = `'OCR-B', 'Arial', 'Courier New', sans-serif`;

    const printContentHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Debit Card Print</title>
          <style>
            @font-face {
              font-family: 'OCR-B';
              src: local('OCR-B'), local('OCRB');
            }
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            @page {
              size: 85.6mm 53.98mm;
              margin: 0;
            }
            .card-print-area {
              width: 85.6mm;
              height: 53.98mm;
              position: relative;
              box-sizing: border-box;
              background: white;
            }
            // .customer-name {
            //   position: absolute;
            //   left: 10mm;
            //   top: 4mm;
            //   font-family: ${embossFontFamily};
            //   font-size: 3.2mm;
            //   font-weight: bold;
            //   color: black;
            //   white-space: nowrap;
            //   letter-spacing: 0.6mm;
            //   line-height: 1;
            //   transform: rotate(180deg);
            // }

            .customer-name {
            position: absolute;
            right: 10mm; /* Adjust this as needed */
            top: 4mm;  /* Adjust this as needed */
            font-family: ${embossFontFamily};
            font-size: 3.2mm;
            font-weight: bold;
            color: black;
            white-space: nowrap;
            letter-spacing: 0.6mm;
            line-height: 1;
            transform: rotate(180deg);
            /* Add these to compensate for the rotation's effect on text direction */
            transform-origin: center; /* You can experiment with 'left center' or other values */
            /* If still having issues with perceived direction, you might need a translateX */
            /* Example: transform: rotate(180deg) translateX(-100%); */
            /* This will shift the element left by its own width after rotation */
        }
          </style>
      </head>
      <body>
          <div class="card-print-area">
              <span class="customer-name">${this.selectedCard.embName.trim().substring(0, 25)}</span>
          </div>
      </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(printContentHtml);
    iframeDoc.close();

    printFrame.onload = () => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (e) {
        console.error('Error triggering print in iframe:', e);
        this.alerts.errorAlert('Print Error', 'Could not trigger print. Please try again.');
      } finally {
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
          this.spinner.hide();
          this.dialog.closeAll();
        }, 1000);
      }
    };
  }

  cancelIssuance() {
    this.resetForm();
  }

  private resetForm() {
    this.showCardDetails = false;
    this.data = [];
    this.dataSource.data = [];
    this.userInput = '';
    this.selectedCard = null;
    this.previewName = 'CUSTOMER NAME';
    this.xOffset = 0;
    this.yOffset = 0;
    this.fontSize = 20;
    this.fontColor = '#000000';
    this.dialog.closeAll();
  }
}


