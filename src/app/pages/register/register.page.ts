import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpService } from 'src/app/services/http.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	public recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
  public classList: any;
  public isClassListAvailable: boolean = false;
  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private httpService: HttpService,
    private angularFireAuth: AngularFireAuth,
    private appService: AppService
  ) {
   }

  ngOnInit() {
    localStorage.clear();
    
    this.httpService.getClassList().subscribe((response: any) => {
      this.classList = response;
      this.isClassListAvailable = true;
      console.log('CLASS LIST: ', this.classList);
    })
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

  async onSubmit(formData: { fullName: string, mobile: string, email: string, class: string, school: string, city: string, tnc: any }) {
    console.log(formData);

    if (formData.fullName == '') {
      this.appService.presentToast('Full Name is required.', "bottom");
    } else if (formData.mobile == '') {
      this.appService.presentToast('Mobile is required.', "bottom");
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

      this.httpService.register(formData).subscribe(async (response: any) => {
          console.log(response);

          if(response.validity) {
            localStorage.setItem('USER_ID', response.user_id);
            localStorage.setItem('MOBILE', formData.mobile);
            localStorage.setItem('EMAIL', formData.email);

            const msg = 'Sending OTP to +91 ' + formData.mobile;

            // this.appService.showLoadingScreen(msg);

            this.auth.signInWithPhoneNumber(this.recaptchaVerifier, '+91' + formData.mobile)
              .then((success) => {
                // this.appService.dismissLoadingScreen();
                console.log('SUCCESS: OTP sent successfully.');
                this.appService.presentToast('OTP sent successfully.', "bottom");
                this.router.navigate(['/register-verify'], { replaceUrl: true });
              });
          } else {
            this.appService.presentToast(response.message, "bottom");
          }
      });
    }
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

}
