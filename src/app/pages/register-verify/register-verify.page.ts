import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.page.html',
  styleUrls: ['./register-verify.page.scss'],
})
export class RegisterVerifyPage implements OnInit {

  private userId: any;
  private mobile: any;
  private user: any;

  constructor(
    public router:Router,
    public route: ActivatedRoute,
    private auth: AuthenticationService,
    private appService: AppService,
    private httpService: HttpService
    ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('USER_ID');
    this.mobile = localStorage.getItem('MOBILE');
  }

  navigateToTargetPage() {
    this.router.navigate(['/login']);
  }
  
  verifyOTP(formData: { otp: string}) {
    console.log(formData);
    // this.appService.showLoadingScreen("Verifying...")
    
    this.auth.enterVerificationCode(formData.otp)
      .then(async (data) => {
        console.log('SUCCESS AccessToken: ', data.multiFactor.user.accessToken);
        console.log('SUCCESS PhoneNumber: ', data.multiFactor.user.phoneNumber);
        console.log('SUCCESS Uid: ', data.multiFactor.user.uid);

        this.user = data.multiFactor.user;

        this.httpService.updateStatus(this.userId)
          .subscribe((data: any) => {
            // this.appService.dismissLoadingScreen();
            if (data.status) {
              this.httpService.getAccessToken(this.mobile, this.userId).subscribe((response: any) => {
                localStorage.setItem('TOKEN', response.token);
                this.router.navigate(['/tabs/home'], { replaceUrl: true });
              });
              
              // const phnNumber = this.user.phoneNumber.match(/\d{10}/);
              // localStorage.setItem('MOBILE', phnNumber);
              
              // this.appService.dismissLoadingScreen();
              // this.router.navigate(['/tabs/home'], { replaceUrl: true });
            } else {
              this.appService.presentToast("Invaild OTP", "bottom");
            }
          });

          // this.appService.dismissLoadingScreen();
      });
  }

}
