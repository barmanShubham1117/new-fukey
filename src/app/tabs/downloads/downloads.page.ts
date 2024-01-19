import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements AfterViewInit {

  type: string = "";
  batchName:string="";
  assets: any[] = [];
  searchableList = ['title','batchName','instructor_name'] ;
  videoTitle:any;
  pdfTitle:any;

  constructor(
    private router: Router,
    private dbService:DbService,
    private appService: AppService,
    private alertController: AlertController
  ) { }

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

}
