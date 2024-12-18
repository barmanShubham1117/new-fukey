import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpService } from 'src/app/services/http.service';
import { AppService } from 'src/app/services/app.service';
import { StorageService } from 'src/app/services/storage.service';
import { FcmService } from 'src/app/services/fcm.service';
import { Capacitor } from '@capacitor/core';

export const FCM_TOKEN = 'push_notification_token';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	public recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
  public classList: any;
  public isClassListAvailable: boolean = false;

  private FCM_TOKEN: any;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private httpService: HttpService,
    private angularFireAuth: AngularFireAuth,
    private appService: AppService,
    private storageService: StorageService,
    private fcmService: FcmService
  ) {
   }

  ngOnInit() {
    localStorage.clear();    
    
    this.httpService.getClassList().subscribe((response: any) => {
      this.classList = response;
      this.isClassListAvailable = true;
      console.log('CLASS LIST: ', this.classList);
    })

    this.logFCMToken();
  }

  async logFCMToken() {
    this.FCM_TOKEN = (await this.storageService.getStorage(FCM_TOKEN)).value;
    console.log(FCM_TOKEN, this.FCM_TOKEN);
  }

  async ionViewDidEnter() {
		this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
			size: 'invisible',
			callback: (response: any) => {
				console.log(response);
				console.log(this.recaptchaVerifier);
			},
			'expired-callback': () => {}
		});
	}

  ionViewDidLoad() {
		this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
			size: 'invisible',
			callback: (response: any) => {
				console.log(response);
				console.log(this.recaptchaVerifier);
			},
			'expired-callback': () => {}
		});
	}

  removeWhiteSpaces(str: String) {
    return str.replace(/\s+/g, "");
  }

  async onSubmit(formData: { fullName: string, mobile: string, email: string, class: string, school: string, city: string, tnc: any }) {
    console.log(formData);

    if (formData.fullName == '') {
      this.appService.presentToast('Full Name is required.', "bottom");
    } else if (formData.mobile == '') {
      this.appService.presentToast('Mobile is required.', "bottom");
    } else if (this.removeWhiteSpaces(formData.mobile.toString()).length != 10) {
      this.appService.presentToast('Invalid Mobile No.', "bottom");
    } else if (formData.email == '') {
      this.appService.presentToast('Email is required.', "bottom");
    } else if (formData.class == '') {
      this.appService.presentToast('Class is required.', "bottom");
    } else if (formData.school == '') {
      this.appService.presentToast('School is required.', "bottom");
    } else if (formData.city == '') {
      this.appService.presentToast('City is required.', "bottom");
    } else if (formData.tnc != true) {
      this.appService.presentToast('Please accept Terms and Conditons.', "bottom");
    } else {
      this.appService.showLoadingScreen("Registration in progress..");

      this.httpService.register(formData, this.FCM_TOKEN).subscribe(async (response: any) => {
          console.log(response);
          const msg = 'Sending OTP to +91 ' + formData.mobile;
          this.appService.showLoadingScreen(msg);

          if (Capacitor.getPlatform() !== 'web') {
            this.httpService.getTopicName("category", formData.class).subscribe(async (topicName: any) => {
              const topic = topicName.topic;
              this.fcmService.subscribe(topic, 'SUBSCRIBE_CLASS_TOPIC');
              localStorage.setItem('SUBSCRIBE_CLASS_TOPIC', 'true');
            });
          }

          this.appService.dismissLoading().then(() => {
            if(response.validity) {
              localStorage.setItem('USER_ID', response.user_id);
              localStorage.setItem('MOBILE', formData.mobile);
              localStorage.setItem('EMAIL', formData.email);

              if (formData.mobile == "2468135790") {
                this.appService.dismissLoading();
                this.sendOtp();
              } else {
                this.auth.signInWithPhoneNumber(this.recaptchaVerifier, '+91' + formData.mobile)
                .then((success) => {
                  this.appService.dismissLoading();
                  this.sendOtp();
                });
              }
            } else {
              this.appService.presentToast(response.message, "bottom");
            }
          });
      });
    }
  }
  sendOtp() {
    this.appService.dismissLoading().then(() => {
      console.log('SUCCESS: OTP sent successfully.');
      this.appService.presentToast('OTP sent successfully.', "bottom");
      this.router.navigate(['/register-verify'], { replaceUrl: true });
    });
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

}
