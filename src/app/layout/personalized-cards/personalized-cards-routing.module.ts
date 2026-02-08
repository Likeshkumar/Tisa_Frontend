import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCvvGenerationPersComponent } from 'app/personalized-cards/checker/auth-cvv-generation-pers/auth-cvv-generation-pers.component';
import { AuthIssuanceOfCardsPersComponent } from 'app/personalized-cards/checker/auth-issuance-of-cards-pers/auth-issuance-of-cards-pers.component';
import { AuthPreGenerationPersComponent } from 'app/personalized-cards/checker/auth-pre-generation-pers/auth-pre-generation-pers.component';
import { AuthReceiveCardsPersComponent } from 'app/personalized-cards/checker/auth-receive-cards-pers/auth-receive-cards-pers.component';
import { AuthRegistrationOfCardsComponent } from 'app/personalized-cards/checker/auth-registration-of-cards/auth-registration-of-cards.component';
import { CvvGenerationPersComponent } from 'app/personalized-cards/maker/cvv-generation-pers/cvv-generation-pers.component';
import { IssuanceOfCardsPersComponent } from 'app/personalized-cards/maker/issuance-of-cards-pers/issuance-of-cards-pers.component';
import { PreDownloadPersComponent } from 'app/personalized-cards/maker/pre-download-pers/pre-download-pers.component';
import { PreGenerationPersComponent } from 'app/personalized-cards/maker/pre-generation-pers/pre-generation-pers.component';
import { ReceiveCardsPersComponent } from 'app/personalized-cards/maker/receive-cards-pers/receive-cards-pers.component';
import { ManualEntryPersComponent } from 'app/personalized-cards/maker/registration-of-cards/manual-entry-pers/manual-entry-pers.component';
import { ViaCbsPersComponent } from 'app/personalized-cards/maker/registration-of-cards/via-cbs-pers/via-cbs-pers.component';
import { TrackStatusComponent } from 'app/personalized-cards/maker/track-status/track-status.component';

const routes: Routes = [

  //Maker 
  { path: 'Manual-Entry', component: ManualEntryPersComponent },
  { path: 'CBS-Reg', component: ViaCbsPersComponent },
  { path: 'Pers-Pin-Gen', component: CvvGenerationPersComponent },
  { path: 'Pers-Pre-Gen', component: PreGenerationPersComponent },
  { path: 'Pers-Pre-File-Download', component: PreDownloadPersComponent },
  { path: 'Pers-Receive-Cards', component: ReceiveCardsPersComponent },
  { path: 'Pers-Issuance-of-Cards', component: IssuanceOfCardsPersComponent },
  { path: 'Pers-Track-Status', component: TrackStatusComponent },

  //Checker

  { path: 'Auth-Reg-Cards', component: AuthRegistrationOfCardsComponent },
  { path: 'Pers-Pin-Gen-Auth', component: AuthCvvGenerationPersComponent },
  { path: 'Pers-Pre-Gen-Auth', component: AuthPreGenerationPersComponent },
  { path: 'Pers-Receive-Cards-Auth', component: AuthReceiveCardsPersComponent },
  { path: 'Pers-Issuance-Cards-Auth', component: AuthIssuanceOfCardsPersComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalizedCardsRoutingModule { }
