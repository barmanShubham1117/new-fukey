import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { AlertController, NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { DbService } from 'src/app/services/db.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements AfterViewInit {

  private MOBILE: any = '';
  private SESSION_ID: any = '';
  type: string = "";
  batchName:string="";
  assets: any[] = [];
  searchableList = ['title','batchName','instructor_name'] ;
  videoTitle:any;
  pdfTitle:any;

  constructor(
    private router: Router,
    private dbService:DbService,
    private httpService: HttpService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { 
    this.MOBILE = localStorage.getItem('MOBILE');
    this.SESSION_ID = localStorage.getItem('SESSION_ID');
  }

  async ngAfterViewInit() {
    this.type = this.router.getCurrentNavigation()?.extras.state?.['type'];
    this.batchName = this.router.getCurrentNavigation()?.extras.state?.['batchName'];
    this.dbService.dbState().subscribe(async (res) => {
      if(res){
        await this.loadAssets();    
      }
    });

  }
  async loadAssets(){
    this.dbService.getDownloadAssetsByBatchName(this.batchName,this.type).then( (assets:any) => {
        if(assets.length > 0){
          this.assets = assets;
          console.log("Download Page: loadAssets(): ", this.assets); 
        }
    });
  }
  openOfflineMaterial(title:string,type: string) {
    this.verifySession();
    const navigationExtras: NavigationExtras = {
      state: {
        title:title,
        type: type
      },
      replaceUrl: false
    }
    console.log("Downloads Page: openOfflineMaterial(): ", navigationExtras);
    
    this.router.navigate(['/tabs/offline-downloads/offline-material'], navigationExtras);
  }
  
  async presentDeleteDialog(title: string, type: string) {
    const alert = await this.alertController.create({
      header: `Are sure you want to delete?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            console.log(`Alert confirmed: ${title}`);
            this.dbService.deleteDownloadAsset(title, type).then(async () => {
              this.assets = [];
              await this.loadAssets();
            });
          },
        }
      ],
    });

    await alert.present();
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
