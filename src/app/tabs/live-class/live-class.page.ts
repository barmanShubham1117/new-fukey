import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-live-class',
  templateUrl: './live-class.page.html',
  styleUrls: ['./live-class.page.scss'],
})
export class LiveClassPage implements OnInit, OnDestroy {

  private username: string = "";
  private MOBILE: string = "";
  private link: string = "";

  constructor(
    private httpService: HttpService,
    private router: Router,
    private inAppBrowser: InAppBrowser,
    private navCtrl: NavController
  ) {
   }

  async getUser() {
    this.httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      console.log(response);
      this.username = response.first_name;
    });
  }
  async startLiveClass(link: string) {
    const browser = await this.inAppBrowser.create(link+"&userName="+this.username, '_blank', 'presentationstyle=formsheet,toolbarposition=top,fullscreen=yes,hideurlbar=yes,toolbarcolor=#176bff,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff,hidenavigationbuttons=no,zoom=no,fullscreen=yes,clearcache=yes,clearsessioncache=yes,location=no,allowautorotate=true')
    browser.on('exit').subscribe(() => {
      console.log("exit detected");
      this.navCtrl.pop();
    });
  }

  ngOnInit() {
    console.log("ngOnInit()");
    
    this.link = this.router.getCurrentNavigation()?.extras.state?.['url'];
    console.log(this.link);
    ScreenOrientation.lock({ orientation: 'landscape' }).then(
      () => {
        console.log('Orientation locked to landscape');
        this.startLiveClass(this.link)
      },
      (error) => {
        console.error('Error locking orientation:', error);
      }
    );
  }

  ngOnDestroy(): void {
    console.log("ionViewWillEnter()");
    ScreenOrientation.lock({ orientation: 'portrait' }).then(
      () => {
        console.log('Orientation locked to portrait');
      },
      (error) => {
        console.error('Error locking orientation:', error);
      }
    );
  }

}
