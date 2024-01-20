import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpService } from 'src/app/services/http.service';
import firebase from 'firebase/compat/app';
import { AppService } from 'src/app/services/app.service';
import { StorageService } from 'src/app/services/storage.service';

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
    private storageService: StorageService
  ) {}

  ngOnInit() {
    console.log("HOME PAGE : GET DATA : USER_ID : ", this.USER_ID);
    console.log("HOME PAGE : GET DATA : MOBILE : ", this.MOBILE);
    console.log("HOME PAGE : GET DATA : TOKEN : ", this.TOKEN);

    localStorage.clear();
    
    this.logFCMToken();
  }

  async logFCMToken() {
    this.FCM_TOKEN = JSON.parse((await this.storageService.getStorage(FCM_TOKEN)).value);
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

  
  async onSubmit(formData: {mobile: string}) {    
    if (formData.mobile != "") {
      this.httpService.checkUser(formData.mobile, this.FCM_TOKEN).subscribe((response: any) => {
        console.log(response);
          if (response.status) {
            localStorage.setItem('MOBILE', formData.mobile);
            
            this.appService.showLoadingScreen("Sending OTP to +91 " + formData.mobile);
  
            this.authService.signInWithPhoneNumber(this.recaptchaVerifier, '+91' + formData.mobile)
                .then((success) => {
                  console.log("LOGIN PAGE : onSubmit() : success : ", success);
                  
                  this.appService.dismissLoading();
                    console.log('SUCCESS: OTP sent successfully.');
                    this.appService.presentToast('OTP sent successfully.', "bottom");
                    this.router.navigate(['/login-verify'], { replaceUrl: true });
                })
                .catch((error) => {
                  this.appService.dismissLoading().then(() => {
                    console.error(error);
                    throw error;
                  });
                });
          } else {
            this.appService.presentToast('Invaild mobile number.', "bottom");
          }
      })
    } else {
      this.appService.presentToast('Please enter mobile no.', "bottom");
    }
  }
}
