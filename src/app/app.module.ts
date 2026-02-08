import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ComponentsModule } from './components/components.module';
import { MakerLayoutComponent } from './layout/maker-layout/maker-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbdSortableHeader } from './sortable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ToastrModule } from 'ngx-toastr';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxDatatableModule } from '@tusharghoshbd/ngx-datatable';
import { DataTablePagerComponent } from './pager.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { InstitutionComponent } from './configuration/maker/institution/institution.component';
import { BinComponent } from './configuration/maker/bin/bin.component';
import { BranchComponent } from './configuration/maker/branch/branch.component';
import { CardTypeComponent } from './configuration/maker/card-type/card-type.component';
import { AccountTypeComponent } from './configuration/maker/account-type/account-type.component';
import { AccountSubTypeComponent } from './configuration/maker/account-sub-type/account-sub-type.component';
import { CurrencyComponent } from './configuration/maker/currency/currency.component';
import { FeeComponent } from './configuration/maker/fee/fee.component';
import { HsmComponent } from './configuration/maker/hsm/hsm.component';
import { PinMailerComponent } from './configuration/maker/pin-mailer/pin-mailer.component';
import { AuthInstitutionComponent } from './configuration/checker/auth-institution/auth-institution.component';
import { AuthBinComponent } from './configuration/checker/auth-bin/auth-bin.component';
import { AuthBranchComponent } from './configuration/checker/auth-branch/auth-branch.component';
import { AuthCardTypeComponent } from './configuration/checker/auth-card-type/auth-card-type.component';
import { AuthAccountTypeComponent } from './configuration/checker/auth-account-type/auth-account-type.component';
import { AuthAccountSubTypeComponent } from './configuration/checker/auth-account-sub-type/auth-account-sub-type.component';
import { AuthFeeComponent } from './configuration/checker/auth-fee/auth-fee.component';
import { AuthHsmComponent } from './configuration/checker/auth-hsm/auth-hsm.component';
import { AuthPinMailerComponent } from './configuration/checker/auth-pin-mailer/auth-pin-mailer.component';
import { AuthCurrencyComponent } from './configuration/checker/auth-currency/auth-currency.component';
import { ManualEntryPersComponent } from './personalized-cards/maker/registration-of-cards/manual-entry-pers/manual-entry-pers.component';
import { ViaCbsPersComponent } from './personalized-cards/maker/registration-of-cards/via-cbs-pers/via-cbs-pers.component';
import { CvvGenerationPersComponent } from './personalized-cards/maker/cvv-generation-pers/cvv-generation-pers.component';
import { PreGenerationPersComponent } from './personalized-cards/maker/pre-generation-pers/pre-generation-pers.component';
import { PreDownloadPersComponent } from './personalized-cards/maker/pre-download-pers/pre-download-pers.component';
import { ReceiveCardsPersComponent } from './personalized-cards/maker/receive-cards-pers/receive-cards-pers.component';
import { IssuanceOfCardsPersComponent } from './personalized-cards/maker/issuance-of-cards-pers/issuance-of-cards-pers.component';
import { AuthIssuanceOfCardsPersComponent } from './personalized-cards/checker/auth-issuance-of-cards-pers/auth-issuance-of-cards-pers.component';
import { AuthReceiveCardsPersComponent } from './personalized-cards/checker/auth-receive-cards-pers/auth-receive-cards-pers.component';
import { AuthPreGenerationPersComponent } from './personalized-cards/checker/auth-pre-generation-pers/auth-pre-generation-pers.component';
import { AuthCvvGenerationPersComponent } from './personalized-cards/checker/auth-cvv-generation-pers/auth-cvv-generation-pers.component';
import { AuthRegistrationOfCardsComponent } from './personalized-cards/checker/auth-registration-of-cards/auth-registration-of-cards.component';
import { CardOrderComponent } from './instant-cards/maker/card-order/card-order.component';
import { CvvGenerationComponent } from './instant-cards/maker/cvv-generation/cvv-generation.component';
import { PreGenerationComponent } from './instant-cards/maker/pre-generation/pre-generation.component';
import { PreFileDownloadComponent } from './instant-cards/maker/pre-file-download/pre-file-download.component';
import { ReceiveCardsComponent } from './instant-cards/maker/receive-cards/receive-cards.component';
import { BranchIssuanceComponent } from './instant-cards/maker/branch-issuance/branch-issuance.component';
import { InstantManualRegistrationComponent } from './instant-cards/maker/registration-of-cards/instant-manual-registration/instant-manual-registration.component';
import { InstantViaCbsRegistrationComponent } from './instant-cards/maker/registration-of-cards/instant-via-cbs-registration/instant-via-cbs-registration.component';
import { AuthCardOrderComponent } from './instant-cards/checker/auth-card-order/auth-card-order.component';
import { AuthCvvGenerationComponent } from './instant-cards/checker/auth-cvv-generation/auth-cvv-generation.component';
import { AuthPreGenerationComponent } from './instant-cards/checker/auth-pre-generation/auth-pre-generation.component';
import { AuthReceiveCardsComponent } from './instant-cards/checker/auth-receive-cards/auth-receive-cards.component';
import { AuthBranchIssuanceComponent } from './instant-cards/checker/auth-branch-issuance/auth-branch-issuance.component';
import { AuthCustomerRegistrationComponent } from './instant-cards/checker/auth-customer-registration/auth-customer-registration.component';
import { ChangeStatusComponent } from './card-management/maker/change-status/change-status.component';
import { PersonalizedComponent } from './card-management/maker/replacement/personalized/personalized.component';
import { InstantComponent } from './card-management/maker/replacement/instant/instant.component';
import { EncryptionComponent } from './card-management/maker/card-enc-dec/encryption/encryption.component';
import { DecryptionComponent } from './card-management/maker/card-enc-dec/decryption/decryption.component';
import { ManualUpdateComponent } from './card-management/maker/update-customer-details/manual-update/manual-update.component';
import { ViaCbsUpdateComponent } from './card-management/maker/update-customer-details/via-cbs-update/via-cbs-update.component';
import { CustomerInfoComponent } from './card-management/maker/customer-info/customer-info.component';
import { AddNewAccountComponent } from './card-management/maker/add-on-account/add-new-account/add-new-account.component';
import { MakePrimaryAccountComponent } from './card-management/maker/add-on-account/make-primary-account/make-primary-account.component';
import { RemoveSecondaryAccountComponent } from './card-management/maker/add-on-account/remove-secondary-account/remove-secondary-account.component';
import { AddNewAccountViaCbsComponent } from './card-management/maker/add-on-account/add-new-account-via-cbs/add-new-account-via-cbs.component';
import { PersonalizationComponent } from './card-management/maker/renewal/personalization/personalization.component';
import { InstantCardComponent } from './card-management/maker/renewal/instant-card/instant-card.component';
import { ResetPinRetryCountComponent } from './card-management/maker/reset-pin-retry-count/reset-pin-retry-count.component';
import { FeeDebitViaCbsComponent } from './card-management/maker/fee-debit-via-cbs/fee-debit-via-cbs.component';
import { AuthCloseCardsComponent } from './card-management/checker/auth-close-cards/auth-close-cards.component';
import { AuthUpdateCustomerDetailsComponent } from './card-management/checker/auth-update-customer-details/auth-update-customer-details.component';
import { AuthAddOnAccountComponent } from './card-management/checker/auth-add-on-account/auth-add-on-account.component';
import { PersonalizedBulkComponent } from './card-management/maker/renewal/personalized-bulk/personalized-bulk.component';
import { NonIssusedReportComponent } from './report/non-issused-report/non-issused-report.component';
import { IssusedReportComponent } from './report/issused-report/issused-report.component';
import { MaintenanceReportComponent } from './report/maintenance-report/maintenance-report.component';
import { AuditTrailReportComponent } from './report/audit-trail-report/audit-trail-report.component';
import { RenewalReportComponent } from './report/renewal-report/renewal-report.component';
import { StockMaintainComponent } from './inventory/stock-maintain/stock-maintain.component';
import { AcknowledgeInHeadOfficeComponent } from './inventory/acknowledge-in-head-office/acknowledge-in-head-office.component';
import { AckInHoComponent } from './stock-management/ack-in-ho/ack-in-ho.component';
import { IssuanceOfCardsToBranchesComponent } from './stock-management/issuance-of-cards-to-branches/issuance-of-cards-to-branches.component';
import { ReceiveCardsInBranchesComponent } from './stock-management/receive-cards-in-branches/receive-cards-in-branches.component';
import { SoftPinComponent } from './card-management/maker/soft-pin/soft-pin.component';
import { RenewalFeatureComponent } from './card-management/maker/renewal/renewal-feature/renewal-feature.component';
import { StockStatusComponent } from './inventory/stock-status/stock-status.component';
import { CardRequestComponent } from './inventory/card-request/card-request.component';
import { IndividualCardLimitComponent } from './card-management/maker/individual-card-limit/individual-card-limit.component';
import { AuthIndividualCardLimitComponent } from './card-management/checker/auth-individual-card-limit/auth-individual-card-limit.component';
import { InstantCardNamePrintComponent } from './instant-cards/instant-card-name-print/instant-card-name-print.component';
import { ViewAccountSubTypeComponent } from './configuration/view/view-account-sub-type/view-account-sub-type.component';
import { ViewAccountTypeComponent } from './configuration/view/view-account-type/view-account-type.component';
import { ViewBinComponent } from './configuration/view/view-bin/view-bin.component';
import { ViewBranchComponent } from './configuration/view/view-branch/view-branch.component';
import { ViewCardTypeComponent } from './configuration/view/view-card-type/view-card-type.component';
import { ViewCurrencyComponent } from './configuration/view/view-currency/view-currency.component';
import { ViewFeeComponent } from './configuration/view/view-fee/view-fee.component';
import { ViewHsmComponent } from './configuration/view/view-hsm/view-hsm.component';
import { ViewInstitutionComponent } from './configuration/view/view-institution/view-institution.component';
import { FeeReportComponent } from './report/fee-report/fee-report.component';
import { TrackStatusComponent } from './personalized-cards/maker/track-status/track-status.component';
import { InsTrackStatusComponent } from './instant-cards/maker/ins-track-status/ins-track-status.component';
import { UnblockUserComponent } from './user-management/unblock/unblock-user/unblock-user.component';
import { AuthUnblockUserComponent } from './user-management/unblock/auth-unblock-user/auth-unblock-user.component';
import { ProfileComponent } from './user-management/maker/profile/profile.component';
import { UserComponent } from './user-management/maker/user/user.component';
import { AuthProfileComponent } from './user-management/checker/auth-profile/auth-profile.component';
import { AuthUserComponent } from './user-management/checker/auth-user/auth-user.component';
import { RequestPasswordComponent } from './user-management/password/request-password/request-password.component';
import { GeneratePasswordComponent } from './user-management/password/generate-password/generate-password.component';
import { AuthGuardService } from './services/auth-guard.service';
import { SessionService } from './services/session.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MakerLayoutComponent,
    DashboardComponent,
    NgbdSortableHeader,
    DataTablePagerComponent,
    PageNotFoundComponent,
    UserDetailsDialogComponent,
    InstitutionComponent,
    BinComponent,
    BranchComponent,
    CardTypeComponent,
    AccountTypeComponent,
    AccountSubTypeComponent,
    CurrencyComponent,
    FeeComponent,
    HsmComponent,
    PinMailerComponent,
    AuthInstitutionComponent,
    AuthBinComponent,
    AuthBranchComponent,
    AuthCardTypeComponent,
    AuthAccountTypeComponent,
    AuthAccountSubTypeComponent,
    AuthFeeComponent,
    AuthHsmComponent,
    AuthPinMailerComponent,
    AuthCurrencyComponent,
    ManualEntryPersComponent,
    ViaCbsPersComponent,
    CvvGenerationPersComponent,
    PreGenerationPersComponent,
    PreDownloadPersComponent,
    ReceiveCardsPersComponent,
    IssuanceOfCardsPersComponent,
    AuthIssuanceOfCardsPersComponent,
    AuthReceiveCardsPersComponent,
    AuthPreGenerationPersComponent,
    AuthCvvGenerationPersComponent,
    AuthRegistrationOfCardsComponent,
    CardOrderComponent,
    CvvGenerationComponent,
    PreGenerationComponent,
    PreFileDownloadComponent,
    ReceiveCardsComponent,
    BranchIssuanceComponent,
    InstantManualRegistrationComponent,
    InstantViaCbsRegistrationComponent,
    AuthCardOrderComponent,
    AuthCvvGenerationComponent,
    AuthPreGenerationComponent,
    AuthReceiveCardsComponent,
    AuthBranchIssuanceComponent,
    AuthCustomerRegistrationComponent,
    ChangeStatusComponent,
    PersonalizedComponent,
    InstantComponent,
    EncryptionComponent,
    DecryptionComponent,
    ManualUpdateComponent,
    ViaCbsUpdateComponent,
    CustomerInfoComponent,
    AddNewAccountComponent,
    MakePrimaryAccountComponent,
    RemoveSecondaryAccountComponent,
    AddNewAccountViaCbsComponent,
    PersonalizationComponent,
    InstantCardComponent,
    ResetPinRetryCountComponent,
    FeeDebitViaCbsComponent,
    AuthCloseCardsComponent,
    AuthUpdateCustomerDetailsComponent,
    AuthAddOnAccountComponent,
    PersonalizedBulkComponent,
    NonIssusedReportComponent,
    IssusedReportComponent,
    MaintenanceReportComponent,
    AuditTrailReportComponent,
    RenewalReportComponent,
    StockMaintainComponent,
    AcknowledgeInHeadOfficeComponent,
    AckInHoComponent,
    IssuanceOfCardsToBranchesComponent,
    ReceiveCardsInBranchesComponent,
    SoftPinComponent,
    RenewalFeatureComponent,
    StockStatusComponent,
    CardRequestComponent,
    IndividualCardLimitComponent,
    AuthIndividualCardLimitComponent,
    InstantCardNamePrintComponent,
    ViewAccountSubTypeComponent,
    ViewAccountTypeComponent,
    ViewBinComponent,
    ViewBranchComponent,
    ViewCardTypeComponent,
    ViewCurrencyComponent,
    ViewFeeComponent,
    ViewHsmComponent,
    ViewInstitutionComponent,
    FeeReportComponent,
    TrackStatusComponent,
    InsTrackStatusComponent,
    UnblockUserComponent,
    AuthUnblockUserComponent,
    ProfileComponent,
    UserComponent,
    AuthProfileComponent,
    AuthUserComponent,
    RequestPasswordComponent,
    GeneratePasswordComponent,
  ],

  imports: [
    BrowserModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
     ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatGridListModule,
    MatListModule,
    MatCheckboxModule,
    MatTabsModule,
    MatStepperModule,
    MatRadioModule,
    MatSortModule,
    ComponentsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxDatatableModule,
    MatToolbarModule,
    MatCardModule,
    MatSidenavModule
  ],

  providers: [
    BnNgIdleService,
    AuthGuardService,
    SessionService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
