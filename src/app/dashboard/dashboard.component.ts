import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService } from 'app/services/rest.service';
import { NotificationService } from 'app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsDialogComponent } from '../user-details-dialog/user-details-dialog.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  username: any;
  userdetails: any;
  institutionId: any;
  data: any;
  dashBoarddetailsList: any = [];
  showMakerRecords: boolean = false;
  showCheckerRecords: boolean = false;

  dashboardInterval$: Subscription;

  constructor(
    public rest: RestService,
    public dialog: MatDialog,
    public alerts: NotificationService
  ) {
    this.userdetails = this.rest.readData('UserDetails');
  }

  ngOnInit(): void {
    this.institutionId = this.rest.readData('InstituteId');
    this.getdashboard();

    this.dashboardInterval$ = interval(30000).subscribe(() => {
      this.getdashboard();
    });
  }

  ngOnDestroy(): void {
    if (this.dashboardInterval$) {
      this.dashboardInterval$.unsubscribe();
    }
  }

  getdashboard(): void {
    const postData = {
      instId: this.institutionId,
      username: this.rest.readData('Username'),
      branchCode: this.rest.readData('branchCode'),
      branchBasedProfile: this.rest.readData('branchBasedProfile'),
      profileFor: this.rest.readData('profileFor'),
    };

    const url = 'get/dashboard';

    this.rest.postValidate(postData, url).subscribe(
      (res: any) => {
        if (res.respCode !== '00') {
          this.alerts.errorAlert(res.respDesc, 'DashBoard');
          return;
        }

        this.rest.saveData('dashBoarddetailsList', JSON.stringify(res));
        this.rest.saveData('profileFlag', res.profileFlag);

        this.dashBoarddetailsList = res.dashBoarddetailsList;

        this.showMakerRecords = res.profileFlag === 'M';
        this.showCheckerRecords = res.profileFlag === 'C';
      },
      (error) => {
        this.alerts.errorAlert('Failed to load dashboard data.', 'DashBoard');
        console.error('Dashboard API error:', error);
      }
    );
  }

  openUserDetailsDialog(): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '500px',
      data: this.dashBoarddetailsList
    });
  }
}





























