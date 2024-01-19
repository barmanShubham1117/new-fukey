import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

import { AppService } from 'src/app/services/app.service';
import { DbService } from 'src/app/services/db.service';
import { File } from '@ionic-native/file/ngx';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

@Component({
  selector: 'offline-study-material',
  templateUrl: './offline-material.page.html',
  styleUrls: ['./offline-material.page.scss'],
})
export class OfflineMaterialPage implements OnInit {

  public title: any;
  public type: any;
  public course_name: any;
  public instructor_name: any;
  public videourl: any;
  public pdfUrl: any;
  public summary: any;
  public file_data:any;
  private USER_ID: any;
  private MOBILE: any;
  private TOKEN: any;
  public fileSrc = "";
  private win: any = window;
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private loader: LoadingController,
    private httpService: HttpService,
    private appService: AppService,
    private dbService:DbService,
    private file:File,
    private _sanitizer: DomSanitizer
  ) { 
  }

  async ngOnInit() {
    // this.appService.showLoadingScreen("Loading..")
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');

    this.title = this.router.getCurrentNavigation()?.extras.state?.['title'];
    this.type = this.router.getCurrentNavigation()?.extras.state?.['type'];
    console.log(this.type);
    this.isFileDownloaded();
  
  }

  async isFileDownloaded(){
    this.dbService.dbState().subscribe(async (res) => {
      if(res){
        this.dbService.getDownloadAsset(this.title,this.type).then((data:any)=>{
              console.log("Offline Material: isFileDownloaded(): ", data);
              
              Filesystem.getUri({
                directory: FilesystemDirectory.Data,
                path: data.filename.replace(/^.*[\\/]/, '')
              }).then((getUriResult) => {
                let path = getUriResult.uri;
                path = this.win.Ionic.WebView.convertFileSrc(path);
                console.log("File path",path);
                this.fileSrc = path;
                console.log("data"+data.type);
                if(data.type=="video"){
                  const videoElement = <HTMLVideoElement>document.getElementById('videoSrc');
                  videoElement.load();
                  videoElement.play();
                }
              }, (error:any) => {
                console.log("error",error);
              });
          this.summary = data.desc;
          this.file_data = data.file_data;
          this.course_name = data.batchName;
          this.instructor_name = data.instructor_name;
        })
        .catch((error) =>{
          console.log("checked file is there:" + error);
        }); 
      }
    });
  }


  playVideo(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  loadBlobtoVideo(){
    // console.log("blob",this.file_data);
    // const file = new File([this.file_data], 'untitled', { type: this.file_data.type })

     console.log("file",window.URL.createObjectURL(this.file_data.data));
    // return file
    this.videourl=window.URL.createObjectURL(this.file_data.data);
  }
  // loadBlobtoPDF(){
  //   const file = new File([this.file_data], 'untitled', { type: this.file_data.type })
  //   console.log("file",file);
  //   return file
  // }

}
