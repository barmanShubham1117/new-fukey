import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser'; 
import { environment } from 'src/environments/environment';
import { NavController, Platform } from '@ionic/angular';
import { Toast } from '@capacitor/toast';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public USERNAME: any;
  public USER_ID: any;
  public MOBILE: any;
  public SESSION_ID: any;

  private shareLink: string = "https://fukeyeducation.com/";
  private ratingLink: string = "";

  public user = {
    name: '',
    class: '',
    city: '',
    mobile: '',
    school: '',
    image: '',
  };

  constructor(
    private httpService: HttpService,
    private router: Router,
    private platform: Platform,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.MOBILE = localStorage.getItem('MOBILE');
    this.SESSION_ID = localStorage.getItem('SESSION_ID');
    this.httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      console.log(response);
      this.USERNAME = response.first_name;

      this.user.image = response.image;
    })

    if (this.platform.is('ios')) {
      console.log('iOS:');

      this.httpService.getIosShareLink().subscribe((response: any) => {
        this.shareLink = response.link;
        console.log(this.shareLink);
      });
      this.httpService.getIosRatingLink().subscribe((response: any) => {
        this.ratingLink = response.link;
        console.log(this.ratingLink);
      });

    } else if (this.platform.is('android')) {
      console.log('Android:');

      this.httpService.getAndroidShareLink().subscribe((response: any) => {
        this.shareLink = response.link;
        console.log(this.shareLink);
      });
      this.httpService.getAndroidRatingLink().subscribe((response: any) => {
        this.ratingLink = response.link;
        console.log(this.ratingLink);
      });
    }
  }

  navigateToAbout() {
    this.verifySession();
    this.router.navigate(['/tabs/about']);
  }

  navigateToTnC() {
    this.verifySession();
    this.router.navigate(['/tabs/tnc']);
  }
  
  navigateToPrivacyPolicy() {
    this.verifySession();
    this.router.navigate(['/tabs/privacy-policy']);
  }

  async rateThisApp() {
    if (this.ratingLink == "") {
      if (this.platform.is('ios')) {
        console.log('iOS:');
        this.httpService.getIosRatingLink().subscribe((response: any) => {
          this.ratingLink = response.link;
          console.log(this.ratingLink);
        });
  
      } else if (this.platform.is('android')) {
        console.log('Android:');
        this.httpService.getAndroidRatingLink().subscribe((response: any) => {
          this.ratingLink = response.link;
          console.log(this.ratingLink);
        });
      }
    } else {
      this.rate(this.ratingLink);
    }
    
  }

  async rate(link: string) {
    await Browser.open({ url: link });
  }

  shareThisApp() {
    if (this.shareLink == "https://fukeyeducation.com/") {
      if (this.platform.is('ios')) {
        console.log('iOS:');
        this.httpService.getIosShareLink().subscribe((response: any) => {
          this.shareLink = response.link;
          console.log(this.shareLink);
        });
      } else if (this.platform.is('android')) {
        console.log('Android:');
        this.httpService.getAndroidShareLink().subscribe((response: any) => {
          this.shareLink = response.link;
          console.log(this.shareLink);
        });
      }
    } else {
      this.share(this.shareLink);
    }
    
  }

  async share(link: string) {
    await Share.share({
      title: 'India\'s Best Online Learning Platform',
      text: 'Want to learn from best teachers? Get this app now.',
      url: link,
      dialogTitle: 'Share with Buddies',
    });
  }

  verifySession() {
    this.httpService.validateUser(this.MOBILE, this.SESSION_ID)
      .subscribe(async (response: any) => {
        console.log(response);
        if (!response.status) {
          await Toast.show({
            text: "You're logged in an another device."
          });
          localStorage.clear();
          const navigationExtras = { replaceUrl: true };
          this.navCtrl.navigateForward(['/login'], navigationExtras);
        }
      });
  }

}
