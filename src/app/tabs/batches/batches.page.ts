import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.page.html',
  styleUrls: ['./batches.page.scss'],
})
export class BatchesPage implements OnInit {
  private TOKEN: any = '';
  private USER_ID: any = '';
  private MOBILE: any = '';
  private SESSION_ID: any = '';
  
  public enrolledCourses: any;
  public isEnrolledCourseAvailable: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private appService: AppService,
    private navCtrl: NavController
  ) {}

  async getEnrolledCourses() {
    this.httpService.getEnrolledCourses(this.TOKEN).subscribe((response: any) => {
      this.enrolledCourses = response;
      console.log('Enrolled Course: ', this.enrolledCourses);
      if (this.enrolledCourses.length > 0) {
        this.isEnrolledCourseAvailable = true;
      }
      this.appService.dismissLoading();
    }); 
  }

  getData() {
    this.appService.showLoadingScreen('Getting your courses..');

    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');
    this.TOKEN = localStorage.getItem('TOKEN');
    this.SESSION_ID = localStorage.getItem('SESSION_ID');

    if (this.TOKEN === undefined) {
      this.httpService.getAccessToken(this.MOBILE, this.USER_ID).subscribe((response: any) => {
        this.TOKEN = response.token;
        localStorage.setItem('TOKEN', this.TOKEN);    
        
        this.getEnrolledCourses();
      });
    } else {
      this.getEnrolledCourses();
    }
  }

  ngOnInit() {
    this.getData();
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
    
    this.router.navigate(['/tabs/batches/course-content'], navigationExtras);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getData();
      event.target.complete();
    }, 2000);
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