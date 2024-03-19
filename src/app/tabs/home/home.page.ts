import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, IonicModule, NavController, Platform } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { App } from '@capacitor/app';
import Swiper from 'swiper';
import { Capacitor } from '@capacitor/core';
import { StorageService } from 'src/app/services/storage.service';
import { FcmService } from 'src/app/services/fcm.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, MatTabsModule]
})
export class HomePage implements OnInit {

  private TOKEN: any = '';
  private USER_ID: any = '';
  private MOBILE: any = '';

  public username: string = 'user';
  public userpic: string = '/assets/new/img2.jpg';
  public courseByClass: any;
  public enrolledCourses: any[] = [];
  public enrolledCourseArray: any[] = [];
  public noOfEnrolledCourse: any = 0;
  public newAllCourses: any[] = [];
  public allLiveClasses: any[] = [];
  public allCourses: any[] = [];
  public courseList: any[] = [];
  public classList: any[] = [];
  public englishCourseList: any[] = [];
  public hindiCourseList: any[] = [];
  public selectedLanguage: string = "english";

  public showEnrolledCourses: boolean = false;

  public FCM_TOKEN: string = '';

  start: any;
  tap = 0;

  public isClassStarted = (timestampString: any) => {
    const timestamp = Number(timestampString);
    const currentTime = Date.now();
    return currentTime / 1000 >= timestamp;
  };

  public extractTimeFromTimestamp = (timestampString: any) => {
    if (!/^\d+$/.test(timestampString)) {
      return null;
    }
  
    const date = new Date(Number(timestampString) * 1000);
  
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
  
    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  public extractDateFromTimestamp = (timestampString: any) => {
    if (!/^\d+$/.test(timestampString)) {
      return null;
    }

    const date = new Date(Number(timestampString) * 1000);

    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]}, ${year}`;
  };
  
  public getCourses = (medium: string, category: string) => {
    this.courseList = [];
    let list = [];
    if (medium === 'english') {
      list = this.englishCourseList;
    } else {
      list = this.hindiCourseList;
    }
    for (const c of list) {
      if ((c.language == medium) && (c.category_id == category)) {
        this.courseList.push(c);
      }
    }
    // console.log("Medium: " + medium);
    // console.log("Category ID: " + category);
    // console.log("List: " + this.courseList.length);
    
    return this.courseList;
  }

  public extractSubjectName = (text: string): string | null => {
    const regex = / (?=\d)/;
    const parts = text.split(regex);
    const subjectName = parts[0];
    // console.log("SUBJECT NAME: " + subjectName);
    
  
    return subjectName;
  }
  
  subscribe: any;
  constructor(
    private httpService: HttpService,
    private appService: AppService,
    private navCtrl: NavController,
    private el: ElementRef,
    private platform: Platform,
    private router: Router,
    private storageService: StorageService,
    private fcmService: FcmService,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.start = 0;
    this.getData();

    if (Capacitor.getPlatform() == 'android') {
      this.platform.backButton.subscribeWithPriority(999, () => {
        // if (!this.routerOutlet?.canGoBack()) {
        //   if (window.confirm("Do you want to exit the app?")) {
        //     App.exitApp();
        //   }
        // }

        const currentUrl = window.location.pathname;
        console.log("HOME PAGE : BACK PRESSED : currrentUrl : ", currentUrl);
        

        if (currentUrl === '/tabs/home') {
          if (this.tap == 0) {
            appService.presentToast("Tap again to exit.", "bottom");
            this.tap = 1;
            setTimeout(() => {
              this.tap = 0;
            }, 3000);
          } else {
            App.exitApp();
          }
        } else {
          window.history.back();
        }
      })
    }
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
  }

  goToBatchesTab() {
    this.navCtrl.navigateRoot('/tabs/batches');
  }
  goToStoreTab() {
    this.navCtrl.navigateRoot('/tabs/store');
  }

  async getAllLiveClasses() {
    this.httpService.getAllLiveClasses().subscribe((response: any) => {
      this.allLiveClasses = response;
      console.log('All Live Class Details: ', this.allLiveClasses);
    });
    this.appService.dismissLoading();
  }

  async getCoursesByClass() {
    console.log('getCoursesByClass: USER_ID: ', this.USER_ID);

    this.httpService.getCoursesByClass(this.USER_ID).subscribe((response) => {
      this.courseByClass = response;
      console.log('All Courses: ', this.courseByClass);
      this.createSubarrays();

      this.getEnrolledCourses();
    });
    this.appService.dismissLoading();
  }

  async getAllCourses() {
    this.httpService.getAllCourses().subscribe((response: any) => {
      this.allCourses = response;
      for(const course of this.allCourses) {
        if(course.language == 'english') {
          this.englishCourseList.push(course);
        }
        else if(course.language == 'hindi') {
          this.hindiCourseList.push(course);
        }
      }
      console.log("English Course List: ", this.englishCourseList);
      console.log("Hindi Course List: ", this.hindiCourseList);
    });
  }

  async getClassList() {
    this.httpService.getClassList().subscribe((response: any) => {
      this.classList = response;
      console.log("Class List: ", this.classList);
      
    });
  }

  async getUserDetail() {
    this.httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      console.log("HOME PAGE : getUserDetail() : response : ", response);
      this.username = response.first_name;
      this.userpic = 'https://learn.fukeyeducation.com/uploads/user_image/' + response.image + '.jpg';

      if (localStorage.getItem('SUBSCRIBE_CLASS_TOPIC') !== 'true') {
        if (Capacitor.getPlatform() !== 'web') {
          this.fcmService.subscribe(response.topic, 'SUBSCRIBE_CLASS_TOPIC');
        }
      }

      this.getAllLiveClasses();

      this.appService.dismissLoading();
    })
  }

  async getEnrolledCourses() {
    console.log(this.TOKEN);
    this.httpService.getEnrolledCourses(this.TOKEN).subscribe((response: any) => {
      this.enrolledCourses = response;
      console.log('Enrolled Course: ', this.enrolledCourses);
      this.noOfEnrolledCourse = this.enrolledCourses.length;
      console.log('No. of Enrolled Course: ', this.noOfEnrolledCourse);

      if (this.noOfEnrolledCourse > 0) {
        this.showEnrolledCourses = true;

        const sec = this.el.nativeElement.querySelector('#showEnrollCourse');
        sec.style.display = 'block';

        const hec = this.el.nativeElement.querySelector('#hideEnrollCourse');
        hec.style.display = 'none';

        const swiper = new Swiper('.swiper', {
          direction: 'horizontal',
          loop: true,
          allowSlidePrev: true,
          pagination: {
            el: '.swiper-pagination',
          },
        });

        if (localStorage.getItem('SUBSCRIBE_COURSE_TOPIC') !== 'true') {
          // if (Capacitor.getPlatform() !== 'web') {
            console.log("Topics to subscribe:");
            
            let eCourses: any[] = []
            this.enrolledCourses.forEach((course: any) => {
              console.log(course.title + ': ' + course.topic);
              eCourses.push(course.id);
              
              // this.fcmService.subscribe(course.topic, 'SUBSCRIBE_COURSE_TOPIC');
            });
            console.log('ENROLLED_COURSES', eCourses);
            
            localStorage.setItem('ENROLLED_COURSES', JSON.stringify(eCourses));
          // }
        }

      } else {
        const sec = this.el.nativeElement.querySelector('#showEnrollCourse');
        sec.style.display = 'none';

        const hec = this.el.nativeElement.querySelector('#hideEnrollCourse');
        hec.style.display = 'block';
      }
      
      this.appService.dismissLoading();
      this.getUserDetail();
    });
  }

  getData() {
    this.appService.showLoadingScreen('Loading your info..');

    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');

    console.log("HOME PAGE : GET DATA : USER_ID : ", this.USER_ID);
    console.log("HOME PAGE : GET DATA : MOBILE : ", this.MOBILE);
    console.log("HOME PAGE : GET DATA : TOKEN : ", this.TOKEN);

    if (this.USER_ID === undefined || this.MOBILE === undefined) {
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      if (this.TOKEN === undefined) {
        this.httpService.getAccessToken(this.MOBILE, this.USER_ID).subscribe((response: any) => {
          this.TOKEN = response.token;
          localStorage.setItem('TOKEN', this.TOKEN);
          console.log("TOKEN1: ", response);
          this.getCoursesByClass();
        });
      }
      else {
        this.getCoursesByClass();
      }
    }
    this.getAllCourses();
    this.getClassList();
  }

  createSubarrays() {
    const originalLength = this.courseByClass.length;

    for (let i = 0; i < originalLength; i += 2) {
      const subArray = this.courseByClass.slice(i, i + 2);
      this.newAllCourses.push(subArray);
    }
    console.log('NEW ARRAY: ', this.newAllCourses);

    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: true,
      allowSlidePrev: true,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  }

  navigateToCourseContentPage(courseId: any) {
    const navigationExtras = {
      state: {
        course_id: courseId
      },
      replaceUrl: false,
    };
    console.log(navigationExtras);

    this.router.navigate(['/tabs/batches/course-content'], navigationExtras);
  }

  swiperSlideChanged() { }

  goNext() { }

  ngOnInit() {
    // if (localStorage.getItem('USER_ID') == undefined || localStorage.getItem('USER_ID') == null ||
    //   localStorage.getItem('TOKEN') == undefined || localStorage.getItem('TOKEN') == null ||
    //   localStorage.getItem('MOBILE') == undefined || localStorage.getItem('MOBILE') == null) {
    //   localStorage.clear();
    //   this.router.navigate(['/login'], { replaceUrl: true });
    //   this.appService.presentToast("No Data in localStorage", "bottom");
    // } else {
    //   this.appService.presentToast("Data is there in localStorage", "bottom");
    // }

    this.FCM_TOKEN = this.storageService.getStorage("push_notification_token").value;
    console.log("Home page: ngOnit(): ", this.FCM_TOKEN);
  }
}
