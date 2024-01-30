import { Component, OnInit, ElementRef, ViewChild, Inject, Input, Output, EventEmitter  } from '@angular/core';
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
  public testData: Record<string, any> = [];
  public startQuizTime: any;
  public quesResponses: Record<string, string[]> = {};
  public quesAns: Record<string, string> = {};
  public correctAnswers: string[] = [];
  public chapterIndex: any;
  public lessonIndex: any;
  public currentLesson: any;
  public quizDetails: any;
  public quizAttempt: any;
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

  @Input() hero: any;
  @Output() closeQuizComponent = new EventEmitter();
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
    this.quizAttempt = [];
    this.quizAttempt.can_attempt = true;

    this.courseData = this.hero.course;
    this.data = this.hero.data;
    this.chapterIndex = this.hero.chapterIndex;
    this.lessonIndex = this.hero.lessonIndex;

    console.log("quiz; ",this.data);
    console.log("quiz; ",this.courseData);
    console.log("quiz; ",this.chapterIndex);
    console.log("quiz; ",this.lessonIndex);

    this.currentLesson = this.data[this.chapterIndex].lessons[this.lessonIndex];

    console.log("quiz; ",this.currentLesson);
    this.timerCount = "Get Ready!"
    this.attempQuiz = false;
    this.getDetails();
    this.httpService.getQuizAttempt(this.currentLesson.id,this.USER_ID).subscribe((response: any) => {
      this.quizAttempt = response;
      console.log("quizAttempt: ", response);
      if (this.quizAttempt.status) {
        this.quizAttempt.can_attempt = false;
        this.quizAttempt.time_taken = parseFloat((this.quizAttempt.time_taken / 60).toString()).toFixed(2);
      } else {
        this.quizAttempt.can_attempt = true;
      }
      console.log("Quiz Attempt Details", this.quizAttempt);
    });

  }

  async getDetails() {
    this.httpService.getQuiz(this.currentLesson.id).subscribe((response: any) => {
      this.quizDetails = response;
      console.log("Quiz Details", this.quizDetails);
      this.quesItems = Array(this.quizDetails.items).fill(0).map((x,i)=>i);
      this.quizDetails.questions.forEach((question: { correct_answers: any; id: string | number; }) => {
        // this.quesResponses[question.id] = [];
        // console.log(question.correct_answers[0]);
        this.quesAns[question.id] = question.correct_answers[0];
      });
      // console.log(this.quesResponses);
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
    this.startQuizTime = Math.floor(new Date().getTime() / 1000);
    this.testData['quiz_id']              =  parseInt(this.quizDetails.id);
    this.testData['user_id']              =  parseInt(this.USER_ID);
    this.testData['date_added']           =  this.startQuizTime.toString();
    this.testData['is_submitted']         =  0;
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
        document.getElementById('completeQuiz')?.click();
        clearInterval(x);
        this.timerCount = "TIME OUT";
      }
    }, 1000);
  }
  
  clear(stepper: MatStepper) {
    (<HTMLFormElement>document.getElementById('submitForm' + (stepper.selectedIndex + 1))).reset();
    console.log('Cleared: submitForm' + (stepper.selectedIndex + 1))
  }

  complete(stepper: MatStepper) {
    this.next(stepper);
    // this.testData['user_answers']         =  JSON.stringify(this.quesResponses);
    // this.testData['correct_answers']      =  JSON.stringify(this.correctAnswers);
    // this.testData['total_obtained_marks'] =  (this.quizDetails.total_marks/this.quizDetails.items) * this.correctAnswers.length;
    // this.testData['date_updated']         =  Math.floor(new Date().getTime() / 1000).toString();
    this.testData['is_submitted']         =  1;
    console.log(this.testData);
    if (this.testData && this.USER_ID) {
      this.httpService.submitTest(this.testData, this.USER_ID).subscribe((response: any) => {
        console.log(response);
      });

      console.log("Progress Error: " + this.USER_ID + " : " + this.currentLesson.course_id + " : " + this.currentLesson.id);
      
      this.httpService.updateUserCurrentProgress(this.USER_ID,this.currentLesson.course_id,this.currentLesson.id).subscribe((response: any) => {
        console.log(response);
        this.httpService.getQuizAttempt(this.currentLesson.id,this.USER_ID).subscribe((response: any) => {
          this.quizAttempt = response;
          if (this.quizAttempt.status) {
            this.quizAttempt.can_attempt = false;
          } else {
            this.quizAttempt.can_attempt = true;
          }
          console.log("Updated Quiz Attempt Details", this.quizAttempt);
        });
        // this.onNextBtnPressed();
      });
    }
  }
  next(stepper: MatStepper) {
    // console.log(stepper.selectedIndex);
    var inputCheck = false;
    const formInputs = document.querySelectorAll('#submitForm' + (stepper.selectedIndex + 1) + ' input');
    for (const node of Array.from(formInputs)) {
      if ((<HTMLInputElement>node).checked) {
        inputCheck = true;
        var quesid = (<HTMLInputElement>node).getAttribute('queid');
        this.quesResponses[quesid as string] = [(<HTMLInputElement>node).value];
        if ((<HTMLInputElement>node).value === this.quesAns[quesid as string]) {
          if (!this.correctAnswers.includes(quesid as string)) {
            // Add the string to the list
            this.correctAnswers.push(quesid as string);
          }
          console.log("correct ans");
        } else {
          const ansIndex = this.correctAnswers.indexOf(quesid as string);
          if (ansIndex !== -1) {
            // Remove the value if it exists
            this.correctAnswers.splice(ansIndex, 1);
          }
          console.log("wrong ans");
        }
        // console.log(this.quizDetails.questions[quesid as string].correct_answers);
        break;
      }
    }
    // console.log(inputCheck);
    if (inputCheck) {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#00bf63";
    } else {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#ff1616";
    }

    this.testData['user_answers']         =  JSON.stringify(this.quesResponses);
    this.testData['correct_answers']      =  JSON.stringify(this.correctAnswers);
    this.testData['total_obtained_marks'] =  (this.quizDetails.total_marks/this.quizDetails.items) * this.correctAnswers.length;
    this.testData['date_updated']         =  Math.floor(new Date().getTime() / 1000).toString();
    this.testData['is_submitted']         =  0;
    localStorage.setItem("QUIZDATA"+this.quizDetails.id,JSON.stringify(this.testData));
    console.log(stepper.selectedIndex);

    if ((<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).classList.contains('bg-marked')) {
      (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).classList.remove('bg-marked');
    }
    console.log("INDEX: ", stepper.selectedIndex);
    
    stepper.next();
  }
  mark(stepper: MatStepper) {
    (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#673ab7";
    (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).classList.add('bg-marked');

    const formInputs = document.querySelectorAll('#submitForm' + (stepper.selectedIndex + 1) + ' input');
    for (const node of Array.from(formInputs)) {
      if ((<HTMLInputElement>node).checked) {
        var quesid = (<HTMLInputElement>node).getAttribute('queid');
        this.quesResponses[quesid as string] = [(<HTMLInputElement>node).value];
        if ((<HTMLInputElement>node).value === this.quesAns[quesid as string]) {
          if (!this.correctAnswers.includes(quesid as string)) {
            // Add the string to the list
            this.correctAnswers.push(quesid as string);
          }
          console.log("correct ans");
        } else {
          const ansIndex = this.correctAnswers.indexOf(quesid as string);
          if (ansIndex !== -1) {
            // Remove the value if it exists
            this.correctAnswers.splice(ansIndex, 1);
          }
          console.log("wrong ans");
        }
        // console.log(this.quizDetails.questions[quesid as string].correct_answers);
        break;
      }
    }
    this.testData['user_answers']         =  JSON.stringify(this.quesResponses);
    this.testData['correct_answers']      =  JSON.stringify(this.correctAnswers);
    this.testData['total_obtained_marks'] =  (this.quizDetails.total_marks/this.quizDetails.items) * this.correctAnswers.length;
    this.testData['date_updated']         =  Math.floor(new Date().getTime() / 1000).toString();
    this.testData['is_submitted']         =  0;
    localStorage.setItem("QUIZDATA"+this.quizDetails.id,JSON.stringify(this.testData));
    
    stepper.next();
  }
  move(stepper: MatStepper, index: number) {
    // console.log(stepper.selectedIndex);
    var inputCheck = false;
    document.querySelectorAll('#submitForm'+(stepper.selectedIndex+1)+' input').forEach((node, index, nodeList) => {
      inputCheck = inputCheck || (<HTMLInputElement>node).checked;
    });
    // console.log(inputCheck);
    if (!(<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).classList.contains('bg-marked')) {
      if (inputCheck) {
        (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#00bf63";
      } else {
        (<HTMLElement>document.getElementById('ques' + (stepper.selectedIndex + 1))).style.backgroundColor = "#ff1616";
      }
    }
    stepper.selectedIndex = index;
  }

  onPreviousBtnPressed() {
    console.log("Button Pressed");
    
    this.closeQuizComponent.emit(false);
  }
  
  onNextBtnPressed() {
    console.log("Button Pressed");
    
    this.closeQuizComponent.emit(true);
  }
}
