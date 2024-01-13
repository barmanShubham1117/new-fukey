import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-offline-downloads',
  templateUrl: './offline-downloads.page.html',
  styleUrls: ['./offline-downloads.page.scss'],
})
export class OfflineDownloadsPage implements OnInit {

  activeTab = 'documents';
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  
  changeActiveTab(event: any) {
    console.log(event.detail.value);
    this.activeTab = event.detail.value;
  }

  openDownloadsPage(type: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        type: type
      },
      replaceUrl: false
    }
    this.router.navigate(['/tabs/offline-downloads/downloads'], navigationExtras);
  }

}
