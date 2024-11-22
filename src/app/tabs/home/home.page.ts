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
import { environment } from 'src/environments/environment.prod';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Toast } from '@capacitor/toast';

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
  private SESSION_ID: any = '';

  public username: string = 'user';
  public userpic: string = '/assets/new/img2.jpg';
  public userImage: string = '';
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
  public subjectList: any[] = [];

  public selectedLanguage: string = "english";
  private classNo: any;
  public isChecked: boolean = false;
  public showEnrolledCourses: boolean = false;
  public FCM_TOKEN: string = '';

  public testimonials: any = [];
  public isTestimonyAvailabe: boolean = false;
  idx = 0;
  private myInterval: any;

  public testimonialName: string = "";
  public testimonialClass: string = "";
  public testimonialSchool: string = "";
  public testimonialDesc: string = "";
  public testimonialImage: string = "";

  isAlertOpen = false;
  alertButtons = ['Cancel'];

  start: any;
  tap = 0;
  selectedItem: string | null = null;

  showPlayPauseBtn = false;
  showPauseBtn = true;
  showPlayBtn = false;
  showMuteBtn = false;
  showUnmuteBtn = true;

  public scheduleList = [];
  public liveClassList = [];
  public isScheduleTabSelected = true;
  isScheduleAvailable = false;
  isLiveClassAvailable = false;

  @ViewChild('classesList', { static: true }) itemListRef: ElementRef | null = null;
  @ViewChild('videoElement') videoElementRef: ElementRef | null = null;
  @ViewChild('videoElement', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  public isClassStarted = (isStarted: any) => {
    if (isStarted == 1) {
      return true;
    } else {
      return false;
    }
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
    return this.courseList;
  }

  public extractSubjectName = (text: string): string | null => {
    const regex = / (?=\d)/;
    const parts = text.split(regex);
    const subjectName = parts[0];
    return subjectName;
  }

  subscribe: any;
  videoElement: any;

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

    if (Capacitor.getPlatform() != 'web') {
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

      ScreenOrientation.lock({ orientation: 'portrait' }).then(
        () => {
          console.log('Orientation locked to portrait');
        },
        (error) => {
          console.error('Error locking orientation:', error);
        }
      );
    }
  }

  onCheckboxChange(event: any) {
    this.isChecked = event.target.checked;
    console.log("Checkbox is now:", this.isChecked);
    this.showSubjects();
  }

  onItemClick(selectedItem: HTMLElement, classId: string) {
    if (this.itemListRef) {
      console.log('Title: ', selectedItem.innerHTML);
      console.log('ID: ', classId);
      this.classNo = classId;

      const items = this.itemListRef.nativeElement.querySelectorAll('.class-item');
      items.forEach((item: any) => item.classList.remove('selected'));
      selectedItem.classList.add('selected');

      this.showSubjects();
    } else {
      console.log(this.itemListRef);
    }
  }

  showSubjects() {
    if (this.isChecked) {
      this.subjectList = this.allCourses.filter(object => object.category_id === this.classNo && object.language === 'hindi');
    } else {
      this.subjectList = this.allCourses.filter(object => object.category_id === this.classNo && object.language === 'english');
    }

    console.log(this.classNo);
    console.log(this.isChecked);
    console.log(this.subjectList);
    console.log(this.allCourses);

    this.createSubarrays();
  }

  goToBatchesTab() {
    this.verifySession();
    this.navCtrl.navigateRoot('/tabs/batches');
  }

  goToStoreTab() {
    this.verifySession();
    this.navCtrl.navigateRoot('/tabs/store');
  }

  async getClasses() {
    this.httpService.getScheduledClasses(this.TOKEN).subscribe((response: any) => {
      this.scheduleList = response;
      console.log('Scheduled Classes: ', this.scheduleList);
    })
    this.httpService.getLiveClasses(this.TOKEN).subscribe((response: any) => {
      this.liveClassList = response;
      console.log('Scheduled Classes: ', this.liveClassList);
    })

    // this.httpService.getAllLiveClasses(this.TOKEN).subscribe((response: any) => {
    //   this.allLiveClasses = response;
    //   console.log('All Live Class Details: ', this.allLiveClasses);
    // });
    
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
      console.log(response);
      
      for (const course of this.allCourses) {
        if (course.language == 'english') {
          this.englishCourseList.push(course);
        }
        else if (course.language == 'hindi') {
          this.hindiCourseList.push(course);
        }
      }
      console.log("English Course List: ", this.englishCourseList);
      console.log("Hindi Course List: ", this.hindiCourseList);
    });
  }

  getClassInfo(val: any, key: string) {
    if (key == "organiser_name") {
      return val.organiser_name;
    } else if (key == "time") {
      return this.extractTimeFromTimestamp(val.time);
    } else if (key == "date") {
      return this.extractDateFromTimestamp(val.time);
    } else if (key == "course_id") {
      return val.course_id;
    }
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
      this.userImage = response.image;
      this.userpic = 'https://learn.fukeyeducation.com/uploads/user_image/' + this.userImage + '.jpg';

      if (localStorage.getItem('SUBSCRIBE_CLASS_TOPIC') !== 'true') {
        if (Capacitor.getPlatform() !== 'web') {
          this.fcmService.subscribe(response.topic, 'SUBSCRIBE_CLASS_TOPIC');
        }
      }

      this.getClasses();

      this.appService.dismissLoading();
    })
  }

  async getEnrolledCourses() {
    console.log('getEnrolledCourses invoked');
    console.log(this.TOKEN);
    this.httpService.getEnrolledCourses(this.TOKEN).subscribe((response: any) => {
      this.enrolledCourses = response;
      console.log('Enrolled Course: ', this.enrolledCourses);
      this.noOfEnrolledCourse = this.enrolledCourses.length;
      console.log('No. of Enrolled Course: ', this.noOfEnrolledCourse);

      if (this.noOfEnrolledCourse > 0) {
        const hec = this.el.nativeElement.querySelector('#enrolled-batches');
        hec.style.display = 'block';

        this.showEnrolledCourses = true;

        const swiper = new Swiper('.swiper', {
          direction: 'horizontal',
          loop: true,
          allowSlidePrev: true,
          pagination: {
            el: '.swiper-pagination2',
          },
        });

        // if (localStorage.getItem('SUBSCRIBE_COURSE_TOPIC') !== 'true') {
        if (Capacitor.getPlatform() !== 'web') {
          console.log("Topics to subscribe:");

          let eCourses: any[] = []
          this.enrolledCourses.forEach((course: any) => {
            console.log(course.title + ': ' + course.topic);
            eCourses.push(course.id);

            this.fcmService.subscribe(course.topic, 'SUBSCRIBE_COURSE_TOPIC');
          });
          console.log('ENROLLED_COURSES', eCourses);

          localStorage.setItem('ENROLLED_COURSES', JSON.stringify(eCourses));
        }
        // }

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
    this.SESSION_ID = localStorage.getItem('SESSION_ID');

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
    this.getTestimonial();
  }

  createSubarrays() {
    const originalLength = this.subjectList.length;
    this.newAllCourses = [];
    for (let i = 0; i < originalLength; i += 2) {
      const subArray = this.subjectList.slice(i, i + 2);
      this.newAllCourses.push(subArray);
    }
    console.log('NEW ARRAY: ', this.newAllCourses);

    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: true,
      allowSlidePrev: true,
      pagination: {
        el: '.swiper-pagination1',
      },
    });
  }

  navigateToCourseContentPage(courseId: any) {
    this.verifySession();
    const navigationExtras = {
      state: {
        course_id: courseId
      },
      replaceUrl: false,
    };
    console.log(navigationExtras);

    this.router.navigate(['/tabs/home/course-content'], navigationExtras);
  }

  swiperSlideChanged() { }

  goNext() { }

  ngOnInit() {
    this.FCM_TOKEN = this.storageService.getStorage("push_notification_token");
    console.log("Home page: ngOnit(): ", this.FCM_TOKEN);

    const show_alert = this.router.getCurrentNavigation()?.extras.state?.['show_alert'];
    console.log(show_alert);
    
    if (show_alert) {
      this.setOpen(true);
    } else {
      this.setOpen(false)
    }
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");

    if (this.videoElementRef) {
      this.videoElement = this.videoElementRef.nativeElement as HTMLVideoElement;

      if (this.videoElement.paused) {
        this.videoElement.play();
      }
    }
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave");
    if (this.videoElement) { // Assuming you have a video reference
      this.videoElement.pause();
    }

    clearInterval(this.myInterval);
    this.setOpen(false)
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.start = 0;
      this.getData();
      event.target.complete();
    }, 2000);
  }

  toggleVideo() {
    if (this.videoElementRef) {
      this.videoElement = this.videoElementRef.nativeElement as HTMLVideoElement;

      if (this.videoElement.paused) {
        this.videoElement.play();
        this.showPauseBtn = true;
        this.showPlayBtn  = false;
      } else {
        this.videoElement.pause();
        this.showPauseBtn = false;
        this.showPlayBtn  = true;
      }
    }

    this.showPlayPauseBtn = true;

    setTimeout(() => {
      this.showPlayBtn = false;
      this.showPauseBtn = false;
      this.showPlayPauseBtn = false;
    }, 2000);
  }

  toggleAudio () {
    if (this.videoPlayer) {
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;

      if (video.muted) {
        video.muted = false;
        this.showMuteBtn = false;
        this.showUnmuteBtn = true;
      } else {
        video.muted = true;
        this.showMuteBtn = true;
        this.showUnmuteBtn = false;
      }      
    }
  }

  async getTestimonial() {
    this.httpService.getTestimonial().subscribe((response: any) => {
      console.log(response);
      this.testimonials = response.testimony;

      if (this.testimonials.length > 0) {
        this.myInterval = setInterval(() => {
          this.testimonialName = this.testimonials[this.idx]?.name;
          this.testimonialImage = environment.BASE_URL + "uploads/testimony/thumbnail/" + this.testimonials[this.idx]?.image;
          this.testimonialClass = this.testimonials[this.idx]?.class + ", " + this.testimonials[this.idx].school;
          this.testimonialDesc = this.testimonials[this.idx]?.testimony;

          this.isTestimonyAvailabe = true;
  
          // console.log(this.idx);
          this.idx++;
          if (this.idx > (this.testimonials.length-1)) {
            this.idx = 0;
          }
        }, 12000);
      }
    })
  }

  verifySession() {
    this.httpService.validateUser(this.MOBILE, this.SESSION_ID)
      .subscribe(async (response: any) => {
        console.log(response);
        if (!response.status) {
          await Toast.show({
            text: "You're logged in an another device."
          });
          localStorage.clear();
          const navigationExtras = { replaceUrl: true };
          this.navCtrl.navigateForward(['/login'], navigationExtras);
        }
      });
  }

  isScheduleTab(val: boolean) {
    this.httpService.getLiveClasses(this.TOKEN).subscribe((response: any) => {console.log(response);});
    this.httpService.getScheduledClasses(this.TOKEN).subscribe((response: any) => {console.log(response);});
    this.isScheduleTabSelected = val;
    const schedule_content = this.el.nativeElement.querySelector('#schedule-content');
    const live_now_content = this.el.nativeElement.querySelector('#live-now-content');

    if (this.isScheduleTabSelected) {
      schedule_content.style.display = "block";
      live_now_content.style.display = "none";
    } else {
      schedule_content.style.display = "none";
      live_now_content.style.display = "block";
    }
  }
}

