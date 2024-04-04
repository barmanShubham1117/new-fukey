import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  private courseList: any;
  public allCourses: any;
  public category: any;

  constructor(
    private httpService: HttpService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllCourses();
  }

  getAllCourses() {
    this.httpService.getAllCourses().subscribe((response) => {
      this.allCourses = response;
      this.courseList = this.allCourses;
      console.log(this.allCourses);
    });
  }

  searchCourse(val: any) {
    console.log(val.value);
    this.httpService.getSearchedCourses(val.value).subscribe((response) => {
      this.allCourses = response;
    })
  }

  getSelectedCourses() {
    if (this.category == "Popular") {
      this.allCourses = this.courseList.filter((course: any) => course.rating > 4);
    } else if (this.category == "Free") {
      this.allCourses = this.courseList.filter((course: any) => course.is_free_course === "1");
    } else if (this.category == "English") {
      this.allCourses = this.courseList.filter((course: any) => course.language === "english");
    } else if (this.category == "Hindi") {
      this.allCourses = this.courseList.filter((course: any) => course.language === "hindi");
    } else {
      this.allCourses = this.courseList;
    }
  }

  navigateToCourseContentPage(courseId: any) {
    const navigationExtras = {
      state: {
        course_id: courseId
      },
      replaceUrl: false,
    };
    console.log(navigationExtras);

    this.router.navigate(['/tabs/store/course-content'], navigationExtras);
  }

  changeCategory(event: any) {
    const clickedButton = event.target as HTMLElement;
    clickedButton.classList.remove('inactive-btn');

    const allButtons = this.el.nativeElement.querySelectorAll('.my-btn');

    allButtons.forEach((button: any) => {
      if (button !== clickedButton) {
        this.renderer.addClass(button, 'inactive-btn');
      }
    });

    this.category = clickedButton.textContent;

    this.getSelectedCourses();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getAllCourses();
      event.target.complete();
    }, 2000);
  }
}

