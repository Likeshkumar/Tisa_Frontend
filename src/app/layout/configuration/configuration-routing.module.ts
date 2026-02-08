import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAccountSubTypeComponent } from 'app/configuration/checker/auth-account-sub-type/auth-account-sub-type.component';
import { AuthAccountTypeComponent } from 'app/configuration/checker/auth-account-type/auth-account-type.component';
import { AuthBinComponent } from 'app/configuration/checker/auth-bin/auth-bin.component';
import { AuthBranchComponent } from 'app/configuration/checker/auth-branch/auth-branch.component';
import { AuthCardTypeComponent } from 'app/configuration/checker/auth-card-type/auth-card-type.component';
import { AuthCurrencyComponent } from 'app/configuration/checker/auth-currency/auth-currency.component';
import { AuthFeeComponent } from 'app/configuration/checker/auth-fee/auth-fee.component';
import { AuthHsmComponent } from 'app/configuration/checker/auth-hsm/auth-hsm.component';
import { AuthInstitutionComponent } from 'app/configuration/checker/auth-institution/auth-institution.component';
import { AccountSubTypeComponent } from 'app/configuration/maker/account-sub-type/account-sub-type.component';
import { AccountTypeComponent } from 'app/configuration/maker/account-type/account-type.component';
import { BinComponent } from 'app/configuration/maker/bin/bin.component';
import { BranchComponent } from 'app/configuration/maker/branch/branch.component';
import { CardTypeComponent } from 'app/configuration/maker/card-type/card-type.component';
import { CurrencyComponent } from 'app/configuration/maker/currency/currency.component';
import { FeeComponent } from 'app/configuration/maker/fee/fee.component';
import { HsmComponent } from 'app/configuration/maker/hsm/hsm.component';
import { InstitutionComponent } from 'app/configuration/maker/institution/institution.component';
import { PinMailerComponent } from 'app/configuration/maker/pin-mailer/pin-mailer.component';
import { ViewAccountSubTypeComponent } from 'app/configuration/view/view-account-sub-type/view-account-sub-type.component';
import { ViewAccountTypeComponent } from 'app/configuration/view/view-account-type/view-account-type.component';
import { ViewBinComponent } from 'app/configuration/view/view-bin/view-bin.component';
import { ViewBranchComponent } from 'app/configuration/view/view-branch/view-branch.component';
import { ViewCardTypeComponent } from 'app/configuration/view/view-card-type/view-card-type.component';
import { ViewCurrencyComponent } from 'app/configuration/view/view-currency/view-currency.component';
import { ViewFeeComponent } from 'app/configuration/view/view-fee/view-fee.component';
import { ViewHsmComponent } from 'app/configuration/view/view-hsm/view-hsm.component';
import { ViewInstitutionComponent } from 'app/configuration/view/view-institution/view-institution.component';

const routes: Routes = [

  //View

  { path: 'View-Institution', component: ViewInstitutionComponent },
  { path: 'View-Bin', component: ViewBinComponent },
  { path: 'View-Branch', component: ViewBranchComponent },
  { path: 'View-Currency', component: ViewCurrencyComponent },
  { path: 'View-Card-Type', component: ViewCardTypeComponent },
  { path: 'View-Account-Type', component: ViewAccountTypeComponent },
  { path: 'View-Account-Sub-Type', component: ViewAccountSubTypeComponent },
  { path: 'View-HSM', component: ViewHsmComponent },
  { path: 'View-Fee', component: ViewFeeComponent },

  //Maker

  { path: 'Institution', component: InstitutionComponent },
  { path: 'Bin', component: BinComponent },
  { path: 'Branch', component: BranchComponent },
  { path: 'Currency', component: CurrencyComponent },
  { path: 'Card-Type', component: CardTypeComponent },
  { path: 'Account-Type', component: AccountTypeComponent },
  { path: 'Account-Sub-Type', component: AccountSubTypeComponent },
  { path: 'HSM', component: HsmComponent },
  { path: 'Pin-Mailer', component: PinMailerComponent },
  { path: 'Fee', component: FeeComponent },
  //Checker

  { path: 'Auth-Institution', component: AuthInstitutionComponent },
  { path: 'Auth-Bin', component: AuthBinComponent },
  { path: 'Auth-Currency', component: AuthCurrencyComponent },
  { path: 'Auth-Card-Type', component: AuthCardTypeComponent },
  { path: 'Auth-Account-Type', component: AuthAccountTypeComponent },
  { path: 'Auth-Account-Sub-Type', component: AuthAccountSubTypeComponent },
  { path: 'Auth-Branch', component: AuthBranchComponent },
  { path: 'Auth-HSM', component: AuthHsmComponent },
  { path: 'Auth-Fee', component: AuthFeeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
