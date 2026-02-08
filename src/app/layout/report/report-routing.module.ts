import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditTrailReportComponent } from 'app/report/audit-trail-report/audit-trail-report.component';
import { FeeReportComponent } from 'app/report/fee-report/fee-report.component';
import { IssusedReportComponent } from 'app/report/issused-report/issused-report.component';
import { MaintenanceReportComponent } from 'app/report/maintenance-report/maintenance-report.component';
import { NonIssusedReportComponent } from 'app/report/non-issused-report/non-issused-report.component';
import { RenewalReportComponent } from 'app/report/renewal-report/renewal-report.component';


const routes: Routes = [
  { path: 'Non-Issused-Report', component: NonIssusedReportComponent },
  { path: 'Issused-Report', component: IssusedReportComponent },
  { path: 'Maintenance-Report', component: MaintenanceReportComponent },
  { path: 'Audit-Trail-Report', component: AuditTrailReportComponent },
  { path: 'Renwal-Report', component: RenewalReportComponent },
  { path: 'Fee_Report', component: FeeReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
