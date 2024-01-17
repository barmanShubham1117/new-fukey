import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

import { AppService } from 'src/app/services/app.service';
import { SafePipe } from 'src/app/safe.pipe';
import { QuizComponent } from 'src/app/components/quiz/quiz.component';
import { FileActionService } from 'src/app/services/fileaction.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-study-material',
  templateUrl: './study-material.page.html',
  styleUrls: ['./study-material.page.scss'],
})
export class StudyMaterialPage implements OnInit {

  public data: any;
  public courseData: any;
  public chapterIndex: any;
  public lessonIndex: any;
  public currentLesson: any;
  public fileDownloaded:boolean = false;
  public isPreviousBtnDisabled: any;
  public isNextBtnDisabled: any;
  public pdfUrl: any;
  public quizUrl: any;

  private USER_ID: any;
  private MOBILE: any;
  private TOKEN: any;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private loader: LoadingController,
    private httpService: HttpService,
    private appService: AppService,
    private dbService:DbService
  ) { 
  }

  async ngOnInit() {
    // this.appService.showLoadingScreen("Loading..")
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');

    this.courseData = this.router.getCurrentNavigation()?.extras.state?.['course'];
    this.data = this.router.getCurrentNavigation()?.extras.state?.['data'];
    this.chapterIndex = this.router.getCurrentNavigation()?.extras.state?.['chapterIndex'];
    this.lessonIndex = this.router.getCurrentNavigation()?.extras.state?.['lessonIndex'];
    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];
    this.currentLesson.instructor_name  = this.courseData.instructor_name;
    this.currentLesson.course_name  = this.courseData.title;
    await this.isFileDownloaded();
    // if (this.currentLesson.lesson_type == 'quiz') {
    //   this.quizUrl = "https://learn.rahulshrivastava.in/home/start_quiz/" + this.currentLesson.id + "/" + this.USER_ID;
    // }
  }

  async download() {
    this.appService.showLoadingScreen('Downloading offline media..');
      await (await this.dbService.downloadFile(this.currentLesson.attachment_url, this.currentLesson.title, this.currentLesson.summary, this.currentLesson.course_name, this.currentLesson.instructor_name, "pdf")).subscribe((result)=>{
        this.appService.dismissLoading().then(() => {
          if(result){
            this.fileDownloaded = true;
            this.appService.presentToast('File saved successfully.','bottom');
          }else{
            this.fileDownloaded = false;
            this.appService.presentToast('Error to download pdf.','bottom');
          }
        });
      });
      
      
    // console.log("course name",this.currentLesson.course_name);
    // console.log("instructor name",this.currentLesson.instructor_name);
    // this.appService.showLoadingScreen('Downloading offline media..');
    // (await this.dbService.downloadAndSavePDF(this.currentLesson.attachment_url, this.currentLesson.title, this.currentLesson.summary, this.currentLesson.course_name, this.currentLesson.instructor_name, "pdf")).subscribe((status:string) => {
    //   this.appService.dismissLoading().then(() => {
    //     if(status == "done"){
    //       this.appService.presentToast('File saved successfully.','bottom');
    //       this.fileDownloaded = true;
    //     }else{
    //       this.appService.presentToast('Error to download pdf.','bottom');
    //       
    //     }    
    //   });
      
    // });
  }
  async downloadVideo() {
    this.appService.showLoadingScreen('Downloading offline media..');
      await (await this.dbService.downloadFile(this.currentLesson.video_url_web, this.currentLesson.title, this.currentLesson.summary, this.currentLesson.course_name, this.currentLesson.instructor_name, "video")).subscribe((result)=>{
        this.appService.dismissLoading().then(() => {
          if(result){
            this.fileDownloaded = true;
            this.appService.presentToast('File saved successfully.','bottom');
          }else{
            this.fileDownloaded = false;
            this.appService.presentToast('Error to download pdf.','bottom');
          }
        });
      });
    // this.appService.showLoadingScreen('Downloading offline media..');
    // var status = (await this.dbService.downloadAndSavePDF(this.currentLesson.video_url_web, this.currentLesson.title, this.currentLesson.summary, this.currentLesson.course_name, this.currentLesson.instructor_name, "video")).subscribe((status:string) => {
    //   this.appService.dismissLoading().then(() => {
    //     if(status == "done"){
    //       this.appService.presentToast('Video saved successfully.','bottom');
    //       this.fileDownloaded = true;
    //     }else{
    //       this.appService.presentToast('Error to download video.','bottom');
    //       this.fileDownloaded = false;
    //     }    
    //   });
      
    // });
  }
  async isFileDownloaded(){
    this.dbService.dbState().subscribe(async (res) => {
      if(res){
        this.dbService.getDownloadAsset(this.currentLesson.title,this.currentLesson.lesson_type == 'video'? 'video':'pdf').then((data:any)=>{
          console.log("checked file is there:"+data.status);
          if(data.status != "Error"){
            this.fileDownloaded = true;
          }else{
            this.fileDownloaded = false;
          }
           
        })
        .catch((error) =>{
          console.log("checked file is there:" + error);
          this.fileDownloaded = false;
        }); 
      }
    });
  }
  convertToEmbedUrl(youtubeUrl: string) {
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  
    if (videoIdMatch && videoIdMatch[1]) {
      const videoId = videoIdMatch[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
      return embedUrl;
    }
    return null;
  }

  playVideo(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async onPreviousBtnPressed() {
    console.log('BEFORE: ', this.chapterIndex);
    console.log('BEFORE: ', this.lessonIndex);

    if (this.chapterIndex <= 0) {
      if (this.lessonIndex <= 0) {
        // Last chapter, so do nothing.
        document.getElementById('previous-btn')!.style.backgroundColor = '#8d8f93';
      } else {
        this.lessonIndex--;
      }
    } else {
      if (this.lessonIndex <= 0) {
        this.chapterIndex--;
        this.lessonIndex = (this.data[this.chapterIndex].lessons.length -1);
      } else {
        this.lessonIndex--;
      }
    }
    this.fileDownloaded = false;
    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];
    this.currentLesson.instructor_name  = this.courseData.instructor_name;
    this.currentLesson.course_name  = this.courseData.title;
    console.log("Current Course Name",this.currentLesson.course_name);
    await this.isFileDownloaded();
  }
  
  async onNextBtnPressed() {
    console.log('BEFORE: ', this.chapterIndex);
    console.log('BEFORE: ', this.lessonIndex);

    if (this.chapterIndex >= (this.data.length - 1)) {
      if (this.lessonIndex >= (this.data[this.chapterIndex].lessons.length - 1)) {
        // Last chapter, so do nothing.
        document.getElementById('next-btn')!.style.backgroundColor = '#8d8f93';
      } else {
        this.lessonIndex++;
      }
    } else {
      if (this.lessonIndex >= (this.data[this.chapterIndex].lessons.length - 1)) {
          this.lessonIndex = 0;
          this.chapterIndex++;
      } else {
        this.lessonIndex++;
      }
    }
    this.fileDownloaded = false;
    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];
    this.currentLesson.instructor_name  = this.courseData.instructor_name;
    this.currentLesson.course_name  = this.courseData.title;
    console.log("Current Course Name",this.currentLesson.course_name);
    await this.isFileDownloaded();
  }

}
