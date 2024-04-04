import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotificationSchema, PushNotifications } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireMessaging } from '@angular/fire/messaging'

import { FCM } from "@capacitor-community/fcm";
import { DbService } from './db.service';
// import { PushNotifications } from "@capacitor/push-notifications";



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
    private storageService: StorageService,
    private firestore: AngularFirestore,
    private dbService: DbService
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
        console.log("Registering Push Notification");
        console.log("FCM_TOKEN: ", this.storageService.getStorage("FCM_TOKEN"));
        
        
        PushNotifications.register();

         // Listen for incoming push notifications
        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push notification received', notification);

          this.dbService.insertMessage(notification.title!, notification.body!, notification.data.story!, notification.data.img!, Math.floor(Date.now() / 1000))
        });
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
    firebase.initializeApp(environment.firebaseConfig);
    const messaging = firebase;

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

          messaging
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

  subscribe(topic: string, key: string): string {
    FCM.subscribeTo({topic: topic})
      .then((res) => { 
        console.log('Subscribed to: ', res);
        localStorage.setItem(key, 'true');
      })
      .catch((err) => { 
        console.log("Error Topic", key);
        
        console.error('Error: ', err);
      });

    return topic;
  }
}
