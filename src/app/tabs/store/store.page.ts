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
  private searchedCourseList: any;
  public allCourses: any;
  public category: any;

  public isFound: boolean = false;
  private searchedValue: any = "";

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

      if (this.allCourses.length > 0) {
        this.isFound = true;
      } else {
        this.isFound = false;
      }
      console.log("isFound: " + this.isFound);
      
    });
  }

  searchCourse(val: any) {
    console.log(val.value);
    this.searchedValue = val.value;
    this.httpService.getSearchedCourses(val.value).subscribe((response) => {
      this.allCourses = response;
      this.searchedCourseList = response;

      if (this.allCourses.length > 0) {
        this.isFound = true;
        this.getSelectedCourses(this.searchedCourseList);
      } else {
        this.isFound = false;
      }
      console.log("isFound: " + this.category);
    })
  }

  getSelectedCourses(list: any) {
    if (this.category == "Popular") {
      this.allCourses = list.filter((course: any) => course.rating > 4);
    } else if (this.category == "Free") {
      this.allCourses = list.filter((course: any) => course.is_free_course === "1");
    } else if (this.category == "English") {
      this.allCourses = list.filter((course: any) => course.language === "english");
    } else if (this.category == "Hindi") {
      this.allCourses = list.filter((course: any) => course.language === "hindi");
    } else {
      this.allCourses = list;
    }

    if (this.allCourses.length > 0) {
      this.isFound = true;
    } else {
      this.isFound = false;
    }
    console.log("isFound: " + this.isFound);
    
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

    if (this.searchedValue == "") {
      this.getSelectedCourses(this.courseList);
    } else {
      this.getSelectedCourses(this.searchedCourseList);
    }

  }

  textChanged(event: any) {
    console.log(event.value);
    this.searchedValue = event.value;
    if (this.searchedValue == "") {
      this.getSelectedCourses(this.courseList);
    } else {
      this.httpService.getSearchedCourses(event.value).subscribe((response) => {
        this.allCourses = response;
        this.searchedCourseList = response;
  
        if (this.allCourses.length > 0) {
          this.isFound = true;
          this.getSelectedCourses(this.searchedCourseList);
        } else {
          this.isFound = false;
        }
        console.log("isFound: " + this.category);
      })
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getAllCourses();
      event.target.complete();
    }, 2000);
  }
}

