import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { RestService } from './rest.service';
import { NotificationService } from './notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_TIMEOUT = 600; // 2 minutes in seconds
  private readonly SESSION_REFRESH_BUFFER = 180; // 30 seconds before expiry
  private sessionRefreshTimer: any;
  private lastActivityTimestamp: number = 0;
  private isMonitoringActive = false;
  private spinnerActive = false;
  institutionId: any;

  constructor(
    private bnIdle: BnNgIdleService,
    private router: Router,
    private rest: RestService,
    private notifyService: NotificationService,
    private spinner: NgxSpinnerService,
    private zone: NgZone
  ) {
    this.spinner.spinnerObservable.subscribe((spinner: any) => {
      this.spinnerActive = spinner && spinner.show === true;
    });
  }

  initializeSessionMonitoring(): void {
    if (this.isMonitoringActive) return;
    this.isMonitoringActive = true;

    this.bnIdle.startWatching(this.SESSION_TIMEOUT).subscribe((isTimedOut: boolean) => {
      if (isTimedOut && !this.isLoginPage() && !this.spinnerActive) {
        this.zone.run(() => {
          this.notifyService.showWarning("Your session has expired due to inactivity.", "Session Expired");
          this.terminateSession();
        });
      }
    });

    this.setupActivityTracking();
    this.startSessionRefreshTimer();
    window.addEventListener('beforeunload', () => this.handleBrowserRefresh());
  }

  private isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  private setupActivityTracking(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, () => {
        this.lastActivityTimestamp = Date.now();
      });
    });
  }

  private startSessionRefreshTimer(): void {
    if (this.sessionRefreshTimer) {
      clearInterval(this.sessionRefreshTimer);
    }

    this.sessionRefreshTimer = setInterval(() => {
      this.checkAndRefreshSession();
    }, 10000);
  }

  private checkAndRefreshSession(): void {
    if (this.isLoginPage() || this.spinnerActive) return;

    const token = this.rest.readData('SESSIONID');
    if (!token) return;

    try {
      const payload = this.parseJwt(token);
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = expiry - now;

      if (timeRemaining < this.SESSION_REFRESH_BUFFER && this.isUserActive()) {
        this.refreshToken();
      }
    } catch (e) {
      console.error('Error parsing JWT:', e);
    }
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  private isUserActive(): boolean {
    return (Date.now() - this.lastActivityTimestamp) < 60000;
  }

  private refreshToken(): void {
    if (this.spinnerActive) return; // Don't refresh if spinner is active

    this.spinner.show();

    let reqata = {
      "instId": this.institutionId,
      "username": this.rest.readData('Username'),
    }
    this.rest.postValidate(reqata, 'refreshtoken').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.respcode === '00' && res.token) {
          this.rest.saveData('SESSIONID', res.token);
          this.notifyService.showWarning('Your session has been extended.', 'Session Refreshed');
        } else {
          this.notifyService.errorAlert('Failed to refresh session.', 'Error');
          this.terminateSession();
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.notifyService.errorAlert('Error refreshing session.', 'Error');
        this.terminateSession();
      }
    );
  }

  private handleBrowserRefresh(): void {
    if (!this.isLoginPage()) {
      this.rest.postValidate({}, 'logout').subscribe(() => {
        this.clearStorage();
      });
    }
  }

  terminateSession(): void {
    clearInterval(this.sessionRefreshTimer);
    this.bnIdle.stopTimer();
    this.isMonitoringActive = false;

    this.rest.postValidate({}, 'logout').subscribe({
      next: () => this.clearStorage(),
      error: () => this.clearStorage()
    });
  }

  private clearStorage(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.spinner.hide();
    this.router.navigate(['/login']);
  }
}
