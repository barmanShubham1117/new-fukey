import { Component, OnInit, ElementRef, ViewChild, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { AppService } from 'src/app/services/app.service';
import { NavController } from '@ionic/angular';

import {FormBuilder, Validators, AbstractControl, FormGroup} from '@angular/forms';

import {MatStepperModule, MatStepper} from '@angular/material/stepper';
import { DOCUMENT } from '@angular/common'; 
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent  implements OnInit {
  public data: any;
  public courseData: any;
  public chapterIndex: any;
  public lessonIndex: any;
  public currentLesson: any;
  public quizDetails: any;
  public quesItems: any;
  public timerCount: any;
  public timeRed: any;
  public attempQuiz: any;

  public isPreviousBtnDisabled: any;
  public isNextBtnDisabled: any;
  public pdfUrl: any;
  public quizUrl: any;

  private USER_ID: any;
  private MOBILE: any;
  private TOKEN: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private appService: AppService,
    public navCtrl: NavController,
    @Inject(DOCUMENT) document: Document
    ) { }
    
    ngOnInit() {
    this.appService.showLoadingScreen("Setting up your Environment");
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');

    this.courseData = this.router.getCurrentNavigation()?.extras.state?.['course'];
    this.data = this.router.getCurrentNavigation()?.extras.state?.['data'];
    this.chapterIndex = this.router.getCurrentNavigation()?.extras.state?.['chapterIndex'];
    this.lessonIndex = this.router.getCurrentNavigation()?.extras.state?.['lessonIndex'];
    // console.log("quiz; ",this.data);
    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];
    // console.log("quiz; ",this.currentLesson);
    this.timerCount = "Get Ready!"
    this.attempQuiz = false;
    this.getDetails();
  }

  async getDetails() {
    this.httpService.getQuiz(this.currentLesson.id).subscribe((response: any) => {
      this.quizDetails = response;
      console.log(this.quizDetails);
      this.quesItems = Array(this.quizDetails.items).fill(0).map((x,i)=>i);
      this.appService.dismissLoading();
      // this.startTimer();
    });
  }
  
  numSequence(n: number): Array<number> { 
    return Array(n); 
  } 

  decodeHtmlCharCodes(str: string) { 
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }
  
  startQuiz(){
    // this.appService.showLoadingScreen("Let's Start!");
    this.attempQuiz = true;
    // this.appService.dismissLoading();
    this.startTimer();
  }

  startTimer() {
    // Set the date we're counting down to
    var diff = this.quizDetails.duration_sec;
    var countDownDate = new Date().getTime() + diff*1000;

    var x = setInterval(() => {
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      // Output the result in an element with id="demo"
      if (hours > 0) {
        this.timerCount = hours + "h " + minutes + "m " + seconds + "s";
      } else {
        this.timerCount = minutes + "m " + seconds + "s";
        if (distance < 120000) {
          this.timeRed = true;
        }
      }
      
      // If the count down is over, write some text 
      if (distance < 0) {
        this.complete();
        clearInterval(x);
        this.timerCount = "TIME OUT";
      }
    }, 1000);
  }
  
  complete() {
    // this.stepper.selected.completed = true;
    // this.stepper.next();
  }
  clear(stepper: MatStepper) {
    (<HTMLFormElement>document.getElementById('submitForm' + (stepper.selectedIndex + 1))).reset();
    console.log('Cleared: submitForm' + (stepper.selectedIndex + 1))
  }
  next(stepper: MatStepper) {
    // console.log(stepper.selectedIndex);
    var inputCheck = false;
    document.querySelectorAll('#submitForm'+(stepper.selectedIndex+1)+' input').forEach((node, index, nodeList) => {
      inputCheck = inputCheck || (<HTMLInputElement>node).checked;
    });
    // console.log(inputCheck);
    if (inputCheck) {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#00bf63";
    } else {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#ff1616";
    }
    // (<HTMLFormElement>document.getElementById('submitForm' + (stepper.selectedIndex + 1))).submit();
    stepper.next();
  }
  mark(stepper: MatStepper) {
    (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#d12929";
    stepper.next();
  }
  move(stepper: MatStepper, index: number) {
    // console.log(stepper.selectedIndex);
    var inputCheck = false;
    document.querySelectorAll('#submitForm'+(stepper.selectedIndex+1)+' input').forEach((node, index, nodeList) => {
      inputCheck = inputCheck || (<HTMLInputElement>node).checked;
    });
    // console.log(inputCheck);
    if (inputCheck) {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#00bf63";
    } else {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#ff1616";
    }
    stepper.selectedIndex = index;
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
