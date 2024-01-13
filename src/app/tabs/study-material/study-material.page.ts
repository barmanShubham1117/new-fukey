import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

import { AppService } from 'src/app/services/app.service';
import { SafePipe } from 'src/app/safe.pipe';

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
  ) { 
  }

  ngOnInit() {
    // this.appService.showLoadingScreen("Loading..")
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');

    this.courseData = this.router.getCurrentNavigation()?.extras.state?.['course'];
    this.data = this.router.getCurrentNavigation()?.extras.state?.['data'];
    this.chapterIndex = this.router.getCurrentNavigation()?.extras.state?.['chapterIndex'];
    this.lessonIndex = this.router.getCurrentNavigation()?.extras.state?.['lessonIndex'];
    console.log(this.data);
    console.log(this.chapterIndex);
    console.log(this.lessonIndex);

    console.log(this.data[this.chapterIndex].lessons[this.lessonIndex]);
    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];

    console.log(this.currentLesson);

    if (this.currentLesson.lesson_type == 'quiz') {
      this.quizUrl = "https://learn.rahulshrivastava.in/home/start_quiz/" + this.currentLesson.id + "/" + this.USER_ID;
    }
  }

  async download() {
    this.httpService.downloadPdf(this.currentLesson.attachment_url).subscribe(
      (blob: Blob) => {
        this.httpService.savePdf(blob, this.currentLesson.title);
      }
    );
  }

  async downloadVideo() {
    this.httpService.downloadVideo(this.currentLesson.video_url, this.currentLesson.title);
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

  onPreviousBtnPressed() {
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

    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];

    console.log('AFTER: ', this.chapterIndex);
    console.log('AFTER: ', this.lessonIndex);
  }
  
  onNextBtnPressed() {
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

    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];

    console.log('Current Lesson: ', this.currentLesson);
    console.log('AFTER: ', this.chapterIndex);
    console.log('AFTER: ', this.lessonIndex);

    console.log('data: ', this.data);
    console.log('course_id: ', this.courseData.id);
    console.log('lesson_id: ', this.data[this.chapterIndex].lessons[this.lessonIndex].id);

  }

}
