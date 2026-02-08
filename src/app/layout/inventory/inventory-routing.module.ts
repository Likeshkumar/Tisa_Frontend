import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcknowledgeInHeadOfficeComponent } from 'app/inventory/acknowledge-in-head-office/acknowledge-in-head-office.component';
import { CardRequestComponent } from 'app/inventory/card-request/card-request.component';
import { StockMaintainComponent } from 'app/inventory/stock-maintain/stock-maintain.component';
import { StockStatusComponent } from 'app/inventory/stock-status/stock-status.component';


const routes: Routes = [

  { path: 'Stock-Maintain', component: StockMaintainComponent },
  { path: 'Bank-Request', component: CardRequestComponent },
  { path: 'Stock-Status', component: StockStatusComponent },
  // { path: 'Inven-Branch-Issuance', component: IssuanceOfCardsToBranchesComponent },
  // { path: 'Inven-Receive-Branch', component: ReceiveCardsInBranchesComponent },
  // { path: 'Inven-Ack-HC', component: AcknowledgeInHeadofficeComponent },
  // { path: 'Inven-Cust-Reg', component: CustomerRegistrationComponent },
  { path: 'Ack-In-HO', component: AcknowledgeInHeadOfficeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
