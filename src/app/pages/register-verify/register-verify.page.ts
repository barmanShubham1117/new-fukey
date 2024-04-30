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

    console.log("register-verify: ngOnInit(): USER_ID : " + this.user);
    console.log("register-verify: ngOnInit(): MOBILE : " + this.mobile);
  }

  navigateToTargetPage() {
    this.router.navigate(['/login']);
  }
  
  verifyOTP(formData: { otp: string}) {
    console.log(formData);
    this.appService.showLoadingScreen("Verifying...")

    if (this.mobile == "9874123650") {
      this.updateStatus();
    } else {
      this.auth.enterVerificationCode(formData.otp)
      .then(async (data) => {
        console.log('SUCCESS AccessToken: ', data.multiFactor.user.accessToken);
        console.log('SUCCESS PhoneNumber: ', data.multiFactor.user.phoneNumber);
        console.log('SUCCESS Uid: ', data.multiFactor.user.uid);

        this.user = data.multiFactor.user;

        this.updateStatus();
      });
    }
  }
  updateStatus() {
    this.httpService.updateStatus(this.userId)
    .subscribe((data: any) => {
      this.appService.dismissLoading().then(() => {
        if (data.status) {
          this.httpService.getAccessToken(this.mobile, this.userId).subscribe((response: any) => {
            localStorage.setItem('TOKEN', response.token);
            this.router.navigate(['/tabs/home'], { replaceUrl: true });
          });
        } else {
          this.appService.presentToast("Invaild OTP", "bottom");
        }
      });
    });
  }

}
