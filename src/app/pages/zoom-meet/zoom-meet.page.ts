import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-zoom-meet',
  templateUrl: './zoom-meet.page.html',
  styleUrls: ['./zoom-meet.page.scss'],
})
export class ZoomMeetPage implements OnInit {

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions
  ) { 
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
          result => console.log('Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
      });
    }
   }

  ngOnInit() {
  }

}
