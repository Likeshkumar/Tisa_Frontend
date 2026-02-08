import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private notify: NotificationService,
    private rest: RestService
  ) { }

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }

    this.notify.showError("Your session has expired. Please login again.", "Session Expired");
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

  private isLoggedIn(): boolean {
    const token = this.rest.readData('SESSIONID');
    if (!token) return false;

    try {
      const payload = this.parseJwt(token);
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) < expiry;
    } catch (e) {
      return false;
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
}