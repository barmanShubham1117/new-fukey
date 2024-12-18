import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { Browser } from '@capacitor/browser'; 
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Toast } from '@capacitor/toast';
import { NavController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.page.html',
  styleUrls: ['./course-content.page.scss'],
})
export class CourseContentPage implements OnInit {

  private TOKEN: any = '';
  private USER_ID: any = '';
  private MOBILE: any = '';
  private SESSION_ID: any = '';
  public iframeSrc = "";
  public showIframe = false;
  public isCourseDataAvailable: boolean = false;
  public isContentDataAvailable: boolean = false;

  public isEnrolledCourse: boolean = false;
  public enrolledCourses: any[] =[];

  public COURSE_DATA: any;
  public CONTENT_DATA: any;
  public COURSE_ID: any;

  public allLiveClasses: any;

  public username: any;

  public isClassStarted = (isStarted: any) => {
    if (isStarted == 1) {
      return true;
    } else {
      return false;
    }
  };
  
  constructor(
    private appService: AppService,
    private httpService: HttpService,
    private fcmService: FcmService,
    private router: Router,
    private inAppBrowser: InAppBrowser,
    private navCtrl: NavController
  ) { 
    this.appService.showLoadingScreen('Loading course content..');
  }

  ngOnInit() { 
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');
    this.SESSION_ID = localStorage.getItem('SESSION_ID');

    this.COURSE_ID = this.router.getCurrentNavigation()?.extras.state?.['course_id'];
    console.log(this.COURSE_ID);
    this.getUser()
    this.getCourse();
  }

  getCourse() {
    this.httpService.getCourseInfoUsingCourseID(this.COURSE_ID)
      .subscribe((response: any) => {
        this.COURSE_DATA = response;
        console.log('COURSE_DATA: ', this.COURSE_DATA);

        this.isCourseDataAvailable = true;
        this.appService.dismissLoading();

        this.getEnrolledCourses();
      });
  }

  getEnrolledCourses(): boolean {
    this.httpService.getEnrolledCourses(this.TOKEN).subscribe((response: any) => {
      this.enrolledCourses = response;
      console.log('Enrolled Course: ', this.enrolledCourses);

      if (this.enrolledCourses.length > 0) {
        for (let i = 0; i < this.enrolledCourses.length; i++) {
          console.log(this.enrolledCourses[i].id);
          console.log(this.COURSE_DATA.id);

          if (this.enrolledCourses[i].id == this.COURSE_DATA.id) {
            this.isEnrolledCourse = true;
            this.getContents();  
          }
        }
      }
    });
    return this.isEnrolledCourse;
  }

  getContents() {
    this.httpService.getSectionsAndLessonsUsingCourseID(this.TOKEN, this.COURSE_ID)
      .subscribe((response: any) => {
        this.appService.dismissLoading().then(() => {
          this.CONTENT_DATA = response

          this.isContentDataAvailable = true;

          console.log('CONTENT_DATA for COURSE_ID: ' + this.COURSE_ID + ': ', this.CONTENT_DATA);
        });
      });
  }

  openDropdown(index: any) {
    let section = document.getElementById('section-bodies-'+index);
    let expandBtn = document.getElementById('expand'+index);
    let collapseBtn = document.getElementById('collapse'+index);
    if (section?.style.display === "none" || section?.style.display === '') {
      section.style.display = "block";
      collapseBtn!.style.display = "block";
      expandBtn!.style.display = "none";
    } else {
      section!.style.display = "none";
      collapseBtn!.style.display = "none";
      expandBtn!.style.display = "block";
    }
  }

  openStudyMaterial(data: any, chapterIndex: any, lessonIndex: any, course_id: any, lesson_id: any) {
    this.verifySession();
    this.httpService.updateUserCurrentProgress(this.USER_ID, course_id, lesson_id).subscribe((response: any) => {
     
      if (
          data != undefined || data != null || 
          chapterIndex != undefined || chapterIndex != null || 
          lessonIndex != undefined || lessonIndex != null
        ) {
          const navigationExtras: NavigationExtras = {
            state: {
              course: this.COURSE_DATA,
              data: data,
              chapterIndex: chapterIndex,
              lessonIndex: lessonIndex
            },
            replaceUrl: false
          }
      
          this.router.navigate(['/tabs/batches/course-content/study-material'], navigationExtras);
      }
    })
  }

  async getUser() {
    this.httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      console.log(response);
      this.username = response.first_name;
    });
  }

  joinMeeting(link: string){
    if (Capacitor.getPlatform() != 'web') {
      this.fcmService.subscribe(this.COURSE_DATA.topic_info.attended_topic, 'ATTENDED');
      this.fcmService.unsubscribe(this.COURSE_DATA.topic_info.unattended_topic, 'ATTENDED');
    }

    const navigationExtras: NavigationExtras = {
      state: {
        url: link
      },
      replaceUrl: false,
    }
    console.log(link);
    
    this.router.navigate(['/tabs/batches/course-content/live-class'], navigationExtras);

    //await Browser.open({ url: environment.BASE_URL+'addons/liveclass/join/'+this.COURSE_ID });
    // await this.inAppBrowser.create(link+"&userName="+this.username, '_blank', 'presentationstyle=formsheet,toolbarposition=top,fullscreen=yes,hideurlbar=yes,toolbarcolor=#176bff,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff,hidenavigationbuttons=no,zoom=no,fullscreen=yes,clearcache=yes,clearsessioncache=yes,location=no,allowautorotate=true')
    // Below Code is working properly 
    // await this.inAppBrowser.create(link, '_self', 'presentationstyle=formsheet,toolbarposition=top,fullscreen=yes,hideurlbar=yes,toolbarcolor=#176bff,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff')

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
}
