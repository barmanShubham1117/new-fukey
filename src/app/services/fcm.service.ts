import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private storageService: StorageService
  ) { }

  async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    try {
      await this.addListeners();
      let permissionStatus = await PushNotifications.checkPermissions();

      if (permissionStatus.receive === 'prompt') {
        permissionStatus = await PushNotifications.requestPermissions();
      }

      if (permissionStatus.receive !== 'granted') {
        permissionStatus = await PushNotifications.requestPermissions();
      }

      if (permissionStatus.receive === 'granted') {
        await PushNotifications.register();
      }

    } catch(e) {
      console.error(e);
      
    }
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log("Delivered Notification: ", notificationList);
  }

  addListeners() {
    PushNotifications.addListener(
      'registration',
      async (token: any) => {
        console.log("MY FCM TOKEN: ", token);
        const fcmToken = (token?.value);
        let go = 1;
        const savedToken = JSON.parse((await this.storageService.getStorage(FCM_TOKEN)).value);
        if (savedToken) {
          if (fcmToken == savedToken) {
            console.log("Same Token Already Exist");
            go = 0;
          } else {
            go = 2;
          }
        }
        if (go == 1) {
          this.storageService.setStorage(FCM_TOKEN, JSON.stringify(fcmToken));
        } else if (go == 2) {
          const data = {
            expired_token: savedToken,
            refreshed_token: fcmToken
          };

          this.storageService.setStorage(FCM_TOKEN, fcmToken);
        }
      }
    );

    PushNotifications.addListener(
      'registrationError',
      (error: any) => {
        console.error("ERROR: ", JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
  
    PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }
}
