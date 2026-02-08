import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthBranchIssuanceComponent } from 'app/instant-cards/checker/auth-branch-issuance/auth-branch-issuance.component';
import { AuthCardOrderComponent } from 'app/instant-cards/checker/auth-card-order/auth-card-order.component';
import { AuthCustomerRegistrationComponent } from 'app/instant-cards/checker/auth-customer-registration/auth-customer-registration.component';
import { AuthCvvGenerationComponent } from 'app/instant-cards/checker/auth-cvv-generation/auth-cvv-generation.component';
import { AuthPreGenerationComponent } from 'app/instant-cards/checker/auth-pre-generation/auth-pre-generation.component';
import { AuthReceiveCardsComponent } from 'app/instant-cards/checker/auth-receive-cards/auth-receive-cards.component';
import { InstantCardNamePrintComponent } from 'app/instant-cards/instant-card-name-print/instant-card-name-print.component';
import { BranchIssuanceComponent } from 'app/instant-cards/maker/branch-issuance/branch-issuance.component';
import { CardOrderComponent } from 'app/instant-cards/maker/card-order/card-order.component';
import { CvvGenerationComponent } from 'app/instant-cards/maker/cvv-generation/cvv-generation.component';
import { InsTrackStatusComponent } from 'app/instant-cards/maker/ins-track-status/ins-track-status.component';
import { PreFileDownloadComponent } from 'app/instant-cards/maker/pre-file-download/pre-file-download.component';
import { PreGenerationComponent } from 'app/instant-cards/maker/pre-generation/pre-generation.component';
import { ReceiveCardsComponent } from 'app/instant-cards/maker/receive-cards/receive-cards.component';
import { InstantManualRegistrationComponent } from 'app/instant-cards/maker/registration-of-cards/instant-manual-registration/instant-manual-registration.component';
import { InstantViaCbsRegistrationComponent } from 'app/instant-cards/maker/registration-of-cards/instant-via-cbs-registration/instant-via-cbs-registration.component';

const routes: Routes = [

  //Maker

  { path: 'Card-Order', component: CardOrderComponent },
  { path: 'Inst-Pin-Gen', component: CvvGenerationComponent },
  { path: 'Inst-Pre-Gen', component: PreGenerationComponent },
  { path: 'Inst-Pre-File-Download', component: PreFileDownloadComponent },
  { path: 'Inst-Receive-Cards', component: ReceiveCardsComponent },
  { path: 'Inst-Issuance-Cards', component: BranchIssuanceComponent },
  { path: 'Inst-Customer-Mapping', component: InstantManualRegistrationComponent },
  { path: 'Inst-CBS-Mapping', component: InstantViaCbsRegistrationComponent },
  { path: 'Inst-Name-Print', component: InstantCardNamePrintComponent },
  { path: 'Inst-Track-Status', component: InsTrackStatusComponent },

  //Checker
  { path: 'Card-Order-Auth', component: AuthCardOrderComponent },
  { path: 'Inst-Pin-Gen-Auth', component: AuthCvvGenerationComponent },
  { path: 'Inst-Pre-Gen-Auth', component: AuthPreGenerationComponent },
  { path: 'Inst-Receive-Cards-Auth', component: AuthReceiveCardsComponent },
  { path: 'Inst-Issuance-Cards-Auth', component: AuthBranchIssuanceComponent },
  { path: 'Inst-Auth-Cust-Map', component: AuthCustomerRegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstantCardsRoutingModule { }
