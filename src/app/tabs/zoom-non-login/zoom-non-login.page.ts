import './zone-flags';
import 'zone.js';
import { Component, NgZone, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Zoom } from '@ionic-native/zoom/ngx';
import { AppService } from 'src/app/services/app.service';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { KEYUTIL, KJUR } from "jsrsasign";
@Component({
  selector: 'zoom-page-nonlogin',
  templateUrl: 'zoom-non-login.page.html',
  styleUrls: ['zoom-non-login.page.scss']
})
export class NonLoginPage {
  // [Warning] In production environment, please DO NOT hardcode your credentials. This is just for demo purpose.
  // Token variables (Retrieve from Rest API)
  zoomToken = '';
  zoomAccessToken = '';
  userId = '';
  SDK_KEY: string = "rwSerL6sSma9PNEmQ1uUrw";
  SDK_SECRET: string = "XS3EC7ymY2S94GdAKl1q17TQdpRzbzSm";
  // Meeting variables
  meetingNumber: any = "9617161034";
  meetingPassword: any = '2400';
  language = 'en-US';
  zoomTitle = "Zoom Meeting";
  startedMeeting = false;
  constructor(
    private toastCtrl: ToastController,
    private zoomService: Zoom,
    private appService: AppService,
    private ngZone: NgZone,
    public platform: Platform
  ) { }

  /**
   * Join a meeting.
   */
  joinMeeting() {
    console.log('Going to join meeting');
    // Prepare meeting option
    const options = {
      custom_meeting_id: "Customized Title",
      no_share: false,
      no_audio: true,
      no_video: false,
      no_driving_mode: true,
      no_invite: true,
      no_meeting_end_message: true,
      no_dial_in_via_phone: false,
      no_dial_out_to_phone: false,
      no_disconnect_audio: true,
      no_meeting_error_message: true,
      no_unmute_confirm_dialog: true,
      no_webinar_register_dialog: false,
      no_titlebar: false,
      no_bottom_toolbar: false,
      no_button_video: false,
      no_button_audio: false,
      no_button_share: false,
      no_button_participants: false,
      no_button_more: false,
      no_text_password: true,
      no_text_meeting_id: false,
      no_button_leave: false
    };
    // Call join meeting method.
    let client = ZoomMtgEmbedded.createClient();
    let meetingSDKElement = <HTMLElement>document.getElementById('meetingSDKElement');
    console.log(meetingSDKElement);
    this.ngZone.runOutsideAngular(() => {
      var signature = this.generateSignature();
      client.init({
        zoomAppRoot: meetingSDKElement, language: 'en-US', customize: {
          video: {
            isResizable: true,
            viewSizes: {
              default: {
                width: 1000,
                height: 600
              },
              ribbon: {
                width: 300,
                height: 700
              }
            }
          },
          // chat: {
          //   popper: {
          //     disableDraggable: true,
          //     anchorElement: meetingSDKChatElement,
          //     placement: 'top'
          //   }
          // }
        }
      }).then(() => {
        client.join({
          sdkKey: this.SDK_KEY,
          signature: signature,//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJyd1Nlckw2c1NtYTlQTkVtUTF1VXJ3IiwibW4iOjk2MTcxNjEwMzQsInJvbGUiOjAsImlhdCI6MTcwNTgzNjg4MCwiZXhwIjoxNzA1ODQ0MDgwLCJhcHBLZXkiOiJyd1Nlckw2c1NtYTlQTkVtUTF1VXJ3IiwidG9rZW5FeHAiOjE3MDU4NDQwODB9.JND4Atup8weWgom-H6-1zlVYdaXt1dMzad44YR4FhGI", // role in SDK signature needs to be 1
          meetingNumber: this.meetingNumber,
          password: this.meetingPassword,
          userEmail: "jayant.jain.co@gmail.com",
          userName: "Jayant Jain",
        }).then(() => {
          this.startedMeeting = true;
          console.log("Width", this.platform.width());
          console.log("Height", this.platform.height());
          console.log("Width",(<HTMLElement>document.getElementById('meetingSDKElement')).clientWidth);
          console.log("Height",(<HTMLElement>document.getElementById('meetingSDKElement')).clientHeight);
          client.updateVideoOptions({
            viewSizes: {
              default: {
                width: (<HTMLElement>document.getElementById('meetingSDKElement')).clientWidth,
                height:(<HTMLElement>document.getElementById('meetingSDKElement')).clientHeight - 70
              }
            }
          })
        })
      })
    })
  }
  generateSignature() {

    const iat = Math.round(new Date().getTime() / 1000) - 300;
    const exp = iat + 60 * 60 * 2;

    const header = {
      'alg': 'HS256',
      'typ': 'JWT'
    };

    // const payload = {
    //     meetingNumber: this.meeting,
    //     role: 0,
    //     sdkKey: this.sdkKey,
    //     iat: iat,
    //     exp: exp
    // }
    const oPayload = {
      sdkKey: this.SDK_KEY,
      mn: this.meetingNumber,
      role: 0,
      iat: iat,
      exp: exp,
      appKey: this.SDK_KEY,
      tokenExp: iat + 60 * 60 * 2
    }

    const signature = KJUR.jws.JWS.sign('HS256', JSON.stringify(header), JSON.stringify(oPayload), this.SDK_SECRET);
    return signature;
  }
}
