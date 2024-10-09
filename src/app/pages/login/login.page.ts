import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpService } from 'src/app/services/http.service';
import firebase from 'firebase/compat/app';
import { AppService } from 'src/app/services/app.service';
import { StorageService } from 'src/app/services/storage.service';
import { FcmService } from 'src/app/services/fcm.service';
import { Capacitor } from '@capacitor/core';

export const FCM_TOKEN = 'push_notification_token';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public recaptchaVerifier?: firebase.auth.RecaptchaVerifier;

  private USER_ID: any;
  private MOBILE: any;
  private TOKEN: any;
  private FCM_TOKEN: any;

  constructor(
    private router:Router,
    private authService: AuthenticationService,
    private httpService: HttpService,
    private appService: AppService,
    private storageService: StorageService,
    private fcmService: FcmService
  ) {}

  ngOnInit() {
    console.log("HOME PAGE : GET DATA : USER_ID : ", this.USER_ID);
    console.log("HOME PAGE : GET DATA : MOBILE : ", this.MOBILE);
    console.log("HOME PAGE : GET DATA : TOKEN : ", this.TOKEN);

    localStorage.clear();
    
    // this.logFCMToken();
  }

  async logFCMToken() {
    this.FCM_TOKEN = (await this.storageService.getStorage(FCM_TOKEN)).value;
    console.log(FCM_TOKEN, this.FCM_TOKEN);
  }

  navigateToTargetPage() {
    this.router.navigate(['/register']);
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

  
  async onSubmit(formData: {mobile: string}) {    
    if (formData.mobile != "") {
      if (this.removeWhiteSpaces(formData.mobile.toString()).length == 10) {
        this.FCM_TOKEN = (await this.storageService.getStorage(FCM_TOKEN)).value;
        console.log("MY FCM TOKEN: " + this.FCM_TOKEN);
        
        this.httpService.checkUser(formData.mobile, this.FCM_TOKEN).subscribe((response: any) => {
          console.log(response);
            if (response.status) {
              localStorage.setItem('MOBILE', formData.mobile);
  
              if (Capacitor.getPlatform() !== 'web') {
                this.fcmService.subscribe("all", 'SUBSCRIBE_ALL_TOPIC');
                localStorage.setItem('SUBSCRIBE_ALL_TOPIC', 'true');
              }
              
              if (formData.mobile == "2468135790" || formData.mobile == "1111111111" || formData.mobile == "2222222222" || formData.mobile == "3333333333" || formData.mobile == "4444444444" || formData.mobile == "5555555555") {
                this.loginVerify();
              } else {
                this.appService.showLoadingScreen("Sending OTP to +91 " + formData.mobile);
    
                this.authService.signInWithPhoneNumber(this.recaptchaVerifier, '+91' + formData.mobile)
                    .then((success) => {
                      console.log("LOGIN PAGE : onSubmit() : success : ", success);
                      
                      this.loginVerify();
                    })
                    .catch((error) => {
                      this.appService.dismissLoading().then(() => {
                        console.error(error);
                        //throw error;
                      });
                    });
              }
              
            } else {
              this.appService.presentToast('Mobile no. not registered.', "bottom");
            }
        })
      } else {
      this.appService.presentToast('Invalid mobile no.', "bottom");
      }
    } else {
      this.appService.presentToast('Please enter mobile no.', "bottom");
    }
  }
  loginVerify() {
    this.appService.dismissLoading();
    this.appService.presentToast('OTP sent successfully.', "bottom");
    this.router.navigate(['/login-verify'], { replaceUrl: true });
  }
}
