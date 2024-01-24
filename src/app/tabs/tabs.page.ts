import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { AppService } from '../services/app.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  private MOBILE: any;
  public name: string = "";
  public std: string = "";

  constructor(
    private router: Router,
    private httpService: HttpService,
    private menuCtrl: MenuController
  ) {
    this.MOBILE = localStorage.getItem('MOBILE');
    httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      this.name = response.first_name;
      this.std = response.class;
    })
   }

  ngOnInit() {}

  closeMenu() {
    this.menuCtrl.close();
  }

  navigateToOfflineDownloads() {
    this.closeMenu();
    this.router.navigate(['/tabs/offline-downloads']);
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
    this.router.navigate(['/login'], { replaceUrl: true});
  }

}
