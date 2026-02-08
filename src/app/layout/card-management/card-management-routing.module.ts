import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAddOnAccountComponent } from 'app/card-management/checker/auth-add-on-account/auth-add-on-account.component';
import { AuthCloseCardsComponent } from 'app/card-management/checker/auth-close-cards/auth-close-cards.component';
import { AuthIndividualCardLimitComponent } from 'app/card-management/checker/auth-individual-card-limit/auth-individual-card-limit.component';
import { AuthUpdateCustomerDetailsComponent } from 'app/card-management/checker/auth-update-customer-details/auth-update-customer-details.component';
import { AddNewAccountViaCbsComponent } from 'app/card-management/maker/add-on-account/add-new-account-via-cbs/add-new-account-via-cbs.component';
import { AddNewAccountComponent } from 'app/card-management/maker/add-on-account/add-new-account/add-new-account.component';
import { MakePrimaryAccountComponent } from 'app/card-management/maker/add-on-account/make-primary-account/make-primary-account.component';
import { RemoveSecondaryAccountComponent } from 'app/card-management/maker/add-on-account/remove-secondary-account/remove-secondary-account.component';
import { DecryptionComponent } from 'app/card-management/maker/card-enc-dec/decryption/decryption.component';
import { EncryptionComponent } from 'app/card-management/maker/card-enc-dec/encryption/encryption.component';
import { ChangeStatusComponent } from 'app/card-management/maker/change-status/change-status.component';
import { CustomerInfoComponent } from 'app/card-management/maker/customer-info/customer-info.component';
import { FeeDebitViaCbsComponent } from 'app/card-management/maker/fee-debit-via-cbs/fee-debit-via-cbs.component';
import { IndividualCardLimitComponent } from 'app/card-management/maker/individual-card-limit/individual-card-limit.component';
import { InstantCardComponent } from 'app/card-management/maker/renewal/instant-card/instant-card.component';
import { PersonalizationComponent } from 'app/card-management/maker/renewal/personalization/personalization.component';
import { PersonalizedBulkComponent } from 'app/card-management/maker/renewal/personalized-bulk/personalized-bulk.component';
import { RenewalFeatureComponent } from 'app/card-management/maker/renewal/renewal-feature/renewal-feature.component';
import { InstantComponent } from 'app/card-management/maker/replacement/instant/instant.component';
import { PersonalizedComponent } from 'app/card-management/maker/replacement/personalized/personalized.component';
import { ResetPinRetryCountComponent } from 'app/card-management/maker/reset-pin-retry-count/reset-pin-retry-count.component';
import { SoftPinComponent } from 'app/card-management/maker/soft-pin/soft-pin.component';
import { ManualUpdateComponent } from 'app/card-management/maker/update-customer-details/manual-update/manual-update.component';
import { ViaCbsUpdateComponent } from 'app/card-management/maker/update-customer-details/via-cbs-update/via-cbs-update.component';

const routes: Routes = [

  //maker
  { path: 'Card-status', component: ChangeStatusComponent },
  { path: 'Instant-Replacement', component: InstantComponent },
  { path: 'Personalized-Replacement', component: PersonalizedComponent },
  { path: 'Instant-Renewal', component: InstantCardComponent },
  { path: 'Personalized-Renewal', component: PersonalizationComponent },
  { path: 'Renewal-Management', component: RenewalFeatureComponent },
  { path: 'Customer-Info', component: CustomerInfoComponent },
  { path: 'Add-on-Account', component: AddNewAccountComponent },
  { path: 'Encryption', component: EncryptionComponent },
  { path: 'Decryption', component: DecryptionComponent },
  { path: 'Update-Details', component: ManualUpdateComponent },
  { path: 'Update-Details-CBS', component: ViaCbsUpdateComponent },
  { path: 'Add-on-Account-Switch', component: MakePrimaryAccountComponent },
  { path: 'Add-on-Account-Removal', component: RemoveSecondaryAccountComponent },
  { path: 'Add-on-Account-CBS', component: AddNewAccountViaCbsComponent },
  { path: 'Personalized-Bulk-Renewal', component: PersonalizedBulkComponent },
  { path: 'Reset-Pin-Count', component: ResetPinRetryCountComponent },
  { path: 'Soft-PIN', component: SoftPinComponent },
  { path: 'Fee-via-cbs', component: FeeDebitViaCbsComponent },
  { path: 'Individual-Limit', component: IndividualCardLimitComponent },
  //checker
  { path: 'CC-Auth', component: AuthCloseCardsComponent },
  { path: 'Auth-Update-Details', component: AuthUpdateCustomerDetailsComponent },
  { path: 'Auth-Add-On-Account', component: AuthAddOnAccountComponent },
  { path: 'Auth-Individual-Limit', component: AuthIndividualCardLimitComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardManagementRoutingModule { }
