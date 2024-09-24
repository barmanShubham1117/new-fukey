import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { AppService } from '../services/app.service';
import { Browser } from '@capacitor/browser'; 
import { MenuController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

export const FCM_TOKEN = 'push_notification_token';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private MOBILE: any;
  private SESSION_ID: any;
  private FCM_TOKEN: any;
  public name: string = "";
  public std: string = "";

  constructor(
    private router: Router,
    private httpService: HttpService,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private storageService: StorageService
  ) {
    this.MOBILE = localStorage.getItem('MOBILE');
    this.SESSION_ID = localStorage.getItem('SESSION_ID');
    httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      this.name = response.first_name;
      this.std = response.class;
    });
   }

  ngOnInit() {
    this.verifySession();
    this.updateFCMToken();
  }
  async updateFCMToken() {
    this.FCM_TOKEN = (await this.storageService.getStorage(FCM_TOKEN)).value;
    console.log("MY FCM TOKEN: " + this.FCM_TOKEN);
    this.httpService.checkUser(this.MOBILE, this.FCM_TOKEN)
      .subscribe((response: any) => {
        console.log("updateFCMToken: ", response);
      })
  }

  verifySession() {
    this.httpService.validateUser(this.MOBILE, this.SESSION_ID)
      .subscribe((response: any) => {
        console.log(response);
        if (!response.status) {
          this.logout();
        }
      });
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  navigateToOfflineDownloads() {
    this.closeMenu();
    this.router.navigate(['/tabs/offline-downloads']);
  }
  
  navigateToEbooks() {
    this.closeMenu();
    this.router.navigate(['/tabs/ebooks']);
  }

  navigateToEditProfile() {
    this.closeMenu()
    this.router.navigate(['/tabs/edit-profile']);
  }
  
  navigateToAbout() {
    this.closeMenu()
    this.router.navigate(['/tabs/about']);
  }

  navigateToTnC() {
    this.closeMenu()
    this.router.navigate(['/tabs/tnc']);
  }
  
  navigateToPrivacyPolicy() {
    this.closeMenu()
    this.router.navigate(['/tabs/privacy-policy']);
  }

  logout() {
    localStorage.clear();
    // this.router.navigateByUrl('/login');

    const navigationExtras = { replaceUrl: true };
    this.navCtrl.navigateForward(['/login'], navigationExtras);
  }

  connect(social: string) {
    if (social === 'facebook') {
      this.openSocial('https://www.facebook.com/people/Futures-Key/pfbid02JinJLJpBz9kYfuVZPGvwy46sskcFAscvfG9vmSho4A8CBNAbYdQuB6kdvKedFKUUl/?mibextid=ZbWKwL');
    } else if (social === 'instagram') {
      this.openSocial('https://www.instagram.com/fukey_education/');
    }
  }

  async openSocial(link: string) {
    await Browser.open({ url: link });
  }

}
