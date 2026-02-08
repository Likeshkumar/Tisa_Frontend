import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RestService } from 'app/services/rest.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personalized',
  templateUrl: './personalized.component.html',
  styleUrls: ['./personalized.component.scss']
})

export class PersonalizedComponent implements OnInit {

  dataSource = new MatTableDataSource<PeriodicElement>();
  cardNo: any;
  newCardNo: any;
  showCardDetails: boolean = false;
  radiobuttonvalue: any = 'cardno';
  customerData: any;
  changeStatus: any;
  changeStat: any;
  institutionId: string;
  selectedOption: string = '';
  userInput: string = '';
  data: any;
  showrecords: boolean = false;

  cardList: any[] = [];
  chnMaskList: string[] = [];
  selectedChnMask: string = '';
  cardDataList: any[] = [];

  constructor(public rest: RestService, private router: Router, private spinner: NgxSpinnerService, public alerts: NotificationService,) { }

  ngOnInit(): void {

    this.institutionId = this.rest.readData('InstituteId');
  }

  // retrieveData() {
  //   this.spinner.show();
  //   let postData: any = {
  //     accountNumber: this.selectedOption === 'account' ? this.userInput : null,
  //     customerName: this.selectedOption === 'customerName' ? this.userInput : null,
  //     customerId: this.selectedOption === 'customerId' ? this.userInput : null,
  //     cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
  //     instId: this.institutionId,
  //   };

  //   this.rest.postValidate(postData, 'cardmaintain/replacelist').subscribe(
  //     (res: any) => {
  //       if (res.error) {
  //         this.spinner.hide();
  //         this.showCardDetails = false;
  //         this.alerts.errorAlert(`Card Maintenance`, res.respDesc);
  //         return;
  //       }

  //       if (res.respCode === '00') {
  //         this.spinner.hide();
  //         if (res.cardMaintenanceList && res.cardMaintenanceList.length > 0) {
  //           this.customerData = res.cardMaintenanceList[0].cardDetails;
  //           // this.changeStatus = res.cardMaintenanceList[0].applicableStatus;
  //           this.showCardDetails = true;
  //         } else {
  //           this.spinner.hide();
  //           this.showCardDetails = false;
  //           this.alerts.errorAlert("Card Maintenance", res.respDesc);
  //         }
  //       } else {
  //         this.spinner.hide();
  //         this.showCardDetails = false;
  //         this.alerts.errorAlert("Card Maintenance", res.respDesc);
  //       }
  //     },
  //     (error: any) => {
  //       this.spinner.hide();
  //       console.error("Error fetching data:", error);
  //     }
  //   );
  // }


  retrieveData() {
    this.spinner.show();
    const postData = {
      accountNumber: this.selectedOption === 'account' ? this.userInput : null,
      customerName: this.selectedOption === 'customerName' ? this.userInput : null,
      customerId: this.selectedOption === 'customerId' ? this.userInput : null,
      cardNumber: this.selectedOption === 'cardNumber' ? this.userInput : null,
      instId: this.institutionId,
    };

    this.rest.postValidate(postData, 'cardmaintain/replacelist').subscribe((res: any) => {
      this.spinner.hide();

      if (res.error || res.respCode !== '00') {
        this.showCardDetails = false;
        this.alerts.errorAlert("Personalized Card Replacement", res.respDesc);
        return;
      }

      if (res.cardMaintenanceList && res.cardMaintenanceList.length > 0) {
        this.cardDataList = res.cardMaintenanceList;
        this.chnMaskList = this.cardDataList.map(item => item.cardDetails.chnMask);

        if (this.chnMaskList.length > 0) {
          this.selectedChnMask = this.chnMaskList[0];
          this.setSelectedCard(this.selectedChnMask);
        }

        this.showCardDetails = true;
      } else {
        this.showCardDetails = false;
        this.alerts.errorAlert("Personalized Card Replacement", res.respDesc);
      }
    }, error => {
      this.spinner.hide();
      this.showCardDetails = false;
      console.error("Error fetching data:", error);
    });
  }

  setSelectedCard(mask: string) {
    if (!mask || typeof mask !== 'string') {
      console.warn('Invalid mask passed to setSelectedCard:', mask);
      return;
    }

    const selected = this.cardDataList.find(c => c.cardDetails.chnMask === mask);

    if (selected) {

      this.customerData = selected.cardDetails;
      this.changeStatus = selected.applicableStatus;
    } else {
      console.warn("No matching card found for mask:", mask);
      this.customerData = null;
      this.changeStatus = [];
    }
  }

  onChnMaskChange(selectedMask: string) {
    this.setSelectedCard(selectedMask);
  }

  submitstatus() {
    this.spinner.show();
    let reqData = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
      "reqType": this.changeStat,
      "accountNumber": this.selectedOption === 'account' ? this.userInput : null,
      "customerName": this.selectedOption === 'customerName' ? this.userInput : null,
      "customerId": this.selectedOption === 'customerId' ? this.userInput : null,
      "cardNumber": this.selectedOption === 'cardNumber' ? this.userInput : null,
      "oldCardNumber": this.cardNo
    }

    this.rest.postValidate(reqData, 'cardmaintain/persressiue').subscribe((res: any) => {
      if (res.respCode == '00') {
        this.spinner.hide();
        this.alerts.successAlert('Personalized Card Replacement', res.respDesc);
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 3000);
      } else {
        this.spinner.hide();
        this.alerts.errorAlert('Personalized Card Replacement', res.respDesc);
      }
    })

  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  onSelectionChange(): void {
    this.userInput = '';
    this.data = [];
    this.showrecords = false;
    this.showCardDetails = false;
    this.dataSource = new MatTableDataSource(this.data);
  }

  getLabelForSelection(option: string): string {
    switch (option) {
      case 'account':
        return 'Enter the Account Number';
      case 'customerName':
        return 'Enter the Customer Name';
      case 'customerId':
        return 'Enter the Customer ID';
      case 'cardNumber':
        return 'Enter the Card Number';
      default:
        return 'Enter Value';
    }
  }

  getPlaceholderForSelection(option: string): string {
    switch (option) {
      case 'account':
        return 'Enter Account Number';
      case 'customerName':
        return 'Enter Customer Name';
      case 'customerId':
        return 'Enter Customer ID';
      case 'cardNumber':
        return 'Enter Card Number';
      default:
        return 'Enter Value';
    }
  }

  getMinLengthForSelection(option: string): number {
    switch (option) {
      case 'account':
        return 16;
      case 'customerName':
        return 4;
      case 'customerId':
        return 6;
      case 'cardNumber':
        return 16;
      default:
        return 0;
    }
  }

  getMaxLengthForSelection(option: string): number {
    switch (option) {
      case 'account':
        return 16;
      case 'customerName':
        return 25;
      case 'customerId':
        return 6;
      case 'cardNumber':
        return 16;
      default:
        return 0;
    }
  }

  getPatternForSelection(option: string): string {
    return '^[0-9]*$';
  }


  getErrorMessage(inputModel: any, option: string): string {
    if (inputModel.errors?.required) {
      return `${this.getLabelForSelection(option)} is required`;
    }
    if (inputModel.errors?.minlength) {
      return `${this.getLabelForSelection(option)} must be at least ${this.getMinLengthForSelection(option)} digit long`;
    }
    if (inputModel.errors?.maxlength) {
      return `${this.getLabelForSelection(option)} cannot exceed ${this.getMaxLengthForSelection(option)} digit`;
    }

    if (inputModel.errors?.pattern) {
      return `${this.getLabelForSelection(option)} must contain only numbers`;
    }

    return '';
  }

  back() {
    this.showCardDetails = false;
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
