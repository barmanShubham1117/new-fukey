import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { Browser } from '@capacitor/browser'; 
@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.page.html',
  styleUrls: ['./course-content.page.scss'],
})
export class CourseContentPage implements OnInit {

  private TOKEN: any = '';
  private USER_ID: any = '';
  private MOBILE: any = '';
  public iframeSrc = "";
  public showIframe = false;
  public isCourseDataAvailable: boolean = false;
  public isContentDataAvailable: boolean = false;

  public COURSE_DATA: any;
  public CONTENT_DATA: any;
  public COURSE_ID: any;
  
  constructor(
    private appService: AppService,
    private httpService: HttpService,
    private router: Router
  ) { 
    this.appService.showLoadingScreen('Loading course content..');
  }

  ngOnInit() { 
    this.USER_ID = localStorage.getItem('USER_ID');
    this.MOBILE = localStorage.getItem('MOBILE');
    this.TOKEN = localStorage.getItem('TOKEN');

    this.COURSE_ID = this.router.getCurrentNavigation()?.extras.state?.['course_id'];
    console.log(this.COURSE_ID);
    this.getCourse();
  }

  getCourse() {
    this.httpService.getCourseInfoUsingCourseID(this.COURSE_ID)
      .subscribe((response: any) => {
        this.COURSE_DATA = response;
        console.log('COURSE_DATA: ', this.COURSE_DATA);

        this.isCourseDataAvailable = true;

        this.getContents();
      });
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
    // this.httpService.updateUserCurrentProgress(this.USER_ID, course_id, lesson_id).subscribe((response: any) => {
      console.log(data);
      console.log(chapterIndex + ' : ' + lessonIndex);
      console.log(data[chapterIndex].lessons[lessonIndex]);
      
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
    // })
  }
  async joinMeeting(){
    // const navigationExtras: NavigationExtras = {
    //   state: {
    //     course: this.COURSE_DATA
    //   },
    //   replaceUrl: false
    // }
    // this.router.navigate(['/zoom-non-login'], navigationExtras);
    await Browser.open({ url: 'https://learn.fukeyeducation.com/addons/liveclass/join/18' });
  }
}
