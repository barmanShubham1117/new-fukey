import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {

  type: string = "";
  batchName:string="";
  assets: any[] = [];
  searchableList = ['title','batchName','instructor_name'] ;
  videoTitle:any;
  pdfTitle:any;
  constructor(
    private router: Router,
    private dbService:DbService
  ) { }

  async ngOnInit() {
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
    this.router.navigate(['/tabs/offline-downloads/offline-material'], navigationExtras);
  }

}
