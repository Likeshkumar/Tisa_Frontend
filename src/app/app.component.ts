import { Component } from '@angular/core';
import { SessionService } from 'app/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'admin';

  constructor(private sessionService: SessionService) {
    this.sessionService.initializeSessionMonitoring();
  }
}