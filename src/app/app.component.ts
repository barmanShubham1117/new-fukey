import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform:Platform,
    public router:Router,
    private fcmService: FcmService
  ) {
    this.platform.ready().then(() => {
      this.fcmService.initPush();
      this.router.navigateByUrl('/splash', { replaceUrl: true });
    })
    .catch((error: any) => {
      console.error(error);
    });
  }
}
