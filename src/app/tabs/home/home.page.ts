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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {

  private TOKEN: any = '';
  private USER_ID: any = '';
  private MOBILE: any = '';

  public username: string = 'user';
  public userpic: string = '/assets/new/img2.jpg';
  public allCourses: any;
  public enrolledCourses: any[] = [];
  public enrolledCourseArray: any[] = [];
  public noOfEnrolledCourse: any = 0;
  public newAllCourses: any[] = [];

  public showEnrolledCourses: boolean = false;

  public FCM_TOKEN: string = '';

  start: any;
  tap = 0;
  selectedItem: string | null = null;
  @ViewChild('classList', { static: true }) itemListRef: ElementRef | null = null;

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

  items = [
    { content: 'Item 1' },
    { content: 'Item 2' },
    { content: 'Item 3' },
    { content: 'Item 4' }
  ];

  onItemClick(selectedItem: HTMLElement) {
    if (this.itemListRef) {
    console.log('Title: ', selectedItem.innerHTML);

    const items = this.itemListRef.nativeElement.querySelectorAll('.class-item');
    items.forEach((item: any) => item.classList.remove('selected'));

    selectedItem.classList.add('selected');
    } else {
      console.log(this.itemListRef);
    }
    
  }

  goToBatchesTab() {
    this.navCtrl.navigateRoot('/tabs/batches');
  }
  goToStoreTab() {
    this.navCtrl.navigateRoot('/tabs/store');
  }

  async getAllCourses() {
    console.log('getAllCourses: USER_ID: ', this.USER_ID);

    this.httpService.getCoursesByClass(this.USER_ID).subscribe((response) => {
      this.allCourses = response;
      console.log('All Courses: ', this.allCourses);
      this.createSubarrays();

      this.getEnrolledCourses();
    });
    this.appService.dismissLoading();
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
        
        // const sec = this.el.nativeElement.querySelector('#enrolled-batches');
        // sec.style.display = 'block';

        const hec = this.el.nativeElement.querySelector('#enrolled-batches');
        hec.style.display = 'none';
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
          this.getAllCourses();
        });
      }
      else {
        this.getAllCourses();
      }
    }
  }

  createSubarrays() {
    const originalLength = this.allCourses.length;

    for (let i = 0; i < originalLength; i += 2) {
      const subArray = this.allCourses.slice(i, i + 2);
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
