import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-offline-downloads',
  templateUrl: './offline-downloads.page.html',
  styleUrls: ['./offline-downloads.page.scss'],
})
export class OfflineDownloadsPage implements OnInit {

  activeTab = 'documents';
  private USER_ID: any;
  private MOBILE: any;
  private TOKEN: any;
  public  pdfs:any[] = [];
  public videos:any[] = [];
  documentBatch: any;
  videoBatch: any;
  searchableList = ['batchName','instructor_name']  
item: any;
  constructor(
    private router: Router,
    private dbService:DbService
  ) {
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');
   }

  async ngOnInit() {
    this.dbService.dbState().subscribe(async (res) => {
      if(res){
        await this.loadPDFDownloadAssets();
        await this.loadVideoDownloadAssets();        
      }
    });

  }
  async loadPDFDownloadAssets(){
    this.dbService.getDownloadAssets("pdf").then( (pdfs:any) => {
      console.log("pdfs"+pdfs);
        if(pdfs.length > 0){
          this.pdfs = pdfs;
        }
    });
  }
  async loadVideoDownloadAssets(){
    this.dbService.getDownloadAssets("video").then( (videos:any) => {
      if(videos.length > 0){
        this.videos = videos;
      }
  });
  }
  changeActiveTab(event: any) {
    console.log(event.detail.value);
    this.activeTab = event.detail.value;
  }

  openDownloadsPage(batchName:string,type: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        batchName:batchName,
        type: type
      },
      replaceUrl: false
    }
    this.router.navigate(['/tabs/offline-downloads/downloads'], navigationExtras);
  }

}
