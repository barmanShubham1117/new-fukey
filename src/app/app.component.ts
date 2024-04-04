import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FcmService } from './services/fcm.service';
import { Capacitor } from '@capacitor/core';

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

    if (localStorage.getItem('SUBSCRIBE_ALL_TOPIC') !== 'true') {
      if (Capacitor.getPlatform() !== 'web') {
        fcmService.subscribe("all", 'SUBSCRIBE_ALL_TOPIC');
        localStorage.setItem('SUBSCRIBE_ALL_TOPIC', 'true');
      }
    }

    this.platform.ready().then(() => {
      this.fcmService.initPush().then(() => { 
        this.router.navigateByUrl('/splash', { replaceUrl: true });
      });
    })
    .catch((error: any) => {
      console.error(error);
    });
  }
}
