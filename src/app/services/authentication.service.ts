import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public confirmationResult?: firebase.auth.ConfirmationResult;

  constructor(private fireAuth: AngularFireAuth, private appService: AppService) { }

  // async signInWithPhoneNumber(mobile: string) {}
  public async signInWithPhoneNumber(recaptchaVerifier: any, phoneNumber: any) {
		return new Promise<any>((resolve, reject) => {
			this.fireAuth
				.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
				.then((confirmationResult) => {
					this.confirmationResult = confirmationResult;
					resolve(confirmationResult);
					recaptchaVerifier.clear();
				})
				.catch((error) => {
					console.log(error);
					if(recaptchaVerifier !=null){
						recaptchaVerifier.clear();
					}
					reject('SMS not sent');
				});
		});
	}

	public async enterVerificationCode(code: string) {
		return new Promise<any>((resolve, reject) => {
			this.confirmationResult
				?.confirm(code)
				.then(async (result) => {
					console.log('SUCCESS');
					
					const user = result.user;
					console.log('SUCCESS: USER: ', user?.uid);
					resolve(user);
					console.log('SUCCESS RESOLVE: USER: ', user?.getIdToken);
				})
				.catch((error) => {
					console.log('ERROR');
					this.appService.dismissLoading();
					this.appService.presentToast("Invalid OTP.", "bottom");
					
					reject(error.message);
				});
		});
	}
}
