import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseContentPage } from './course-content.page';

describe('CourseContentPage', () => {
  let component: CourseContentPage;
  let fixture: ComponentFixture<CourseContentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CourseContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
