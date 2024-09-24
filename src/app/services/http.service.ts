import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public USER_ID: any = localStorage.getItem("USER_ID");
  public MOBILE: any = localStorage.getItem("MOBILE");
  public TOKEN: any = localStorage.getItem("TOKEN");

  constructor(
    private http: HttpClient
  ) { }

  public setUserID(id: any) {
    this.USER_ID = id;
  }
  public setMobile(mobile: any) {
    this.MOBILE = mobile;
  }
  public setToken(token: any) {
    this.TOKEN = token;
  }
  public getUserID() {
    return this.USER_ID;
  }
  public getMobile() {
    return this.MOBILE;
  }
  public getToken() {
    return this.TOKEN;
  }

  public clearData() {
    localStorage.clear();
    this.USER_ID = undefined;
    this.MOBILE = undefined;
    this.TOKEN = undefined;
  }

  public register(formData:any, fcmToken:any) {

    let body = `first_name=${formData.fullName}&last_name=%20&email=${formData.email}&password=%20&city=${formData.city}&mobile=%2B91${formData.mobile}&class=${formData.class}&school=${formData.school}&city=${formData.city}&fcm_token=${fcmToken}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'signup', body, httpOptions);
  }
  
  public checkUser(mobile: any, fcmToken: string) {

    let body = `mobile=%2B91${mobile}&fcm_token=${fcmToken}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'check_user', body, httpOptions);
  }
  
  public updateStatus(userId: any) {

    let body = `user_id=${userId}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'update_status', body, httpOptions);
  }

  public getUserViaMobile(mobile: string) {
    let body = `mobile=%2B91${mobile}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'get_user', body, httpOptions);
  }
  
  public getAccessToken(mobile: string, userId: any) {
    let body = `mobile=%2B91${mobile}&userId=${userId}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'get_access_token', body, httpOptions);
  }

  public getSessionViaMobile(mobile: string) {
    let body = `mobile=%2B91${mobile}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'get_session', body, httpOptions);
  }

  public validateUser(mobile: string, sessionId: string) {
    let body = `mobile=%2B91${mobile}&sessionId=${sessionId}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'validate_user', body, httpOptions);
  }

  public updateProfilePicture(file: File, userId: any) {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    formData.append('user_id', userId.toString());

    return this.http.post(environment.BASE_API_URL + 'upload_profile_photo', formData);
  }
  
  // save data in `quiz_results` table
  public submitTest(data: any, userId: any) {
    const formData: FormData = new FormData();
    formData.append('quiz_id',               data['quiz_id']);
    formData.append('user_id',               userId);
    formData.append('user_answers',          data['user_answers']);
    formData.append('correct_answers',       data['correct_answers']);
    formData.append('total_obtained_marks',  data['total_obtained_marks']);
    formData.append('date_added',            data['date_added']);
    formData.append('date_updated',          data['date_updated']);
    formData.append('is_submitted',          data['is_submitted']);

    return this.http.post(environment.BASE_API_URL + 'submit_test_attempt', formData);
  }

  public getSearchedCourses(val: string) {
    return this.http.get(environment.BASE_API_URL + 'courses_by_search_string?search_string=' + val);
  }

  public getClassList() {
    return this.http.get(environment.BASE_API_URL + 'class_list/0');
  }

  public getEnrolledCourses(token: string) {
    return this.http.get(environment.BASE_API_URL + 'my_courses?auth_token=' + token);
  }

  public getAllCourses() {
    return this.http.get(environment.BASE_API_URL + 'all_courses');
  }

  public getAllEbooks() {
    return this.http.get(environment.BASE_API_URL + 'all_ebooks');
  }

  public getFreeCourses() {
    return this.http.get(environment.BASE_API_URL + 'free_courses');
  }

  public getPopularCourses() {
    return this.http.get(environment.BASE_API_URL + 'popular_courses');
  }
  
  public getTests() {
    return this.http.get(environment.BASE_API_URL + 'tests');
  }
  
  public getCoursesByClass(userId: string) {
    return this.http.get(environment.BASE_API_URL + 'class_wise_course?user_id=' + userId);
  }

  public getCourseInfoUsingCourseID(courseId: string) {
    return this.http.get(environment.BASE_API_URL + 'course_object_by_id?course_id=' + courseId);
  }
  
  public getSectionsAndLessonsUsingCourseID(token: string, courseId: string) {
    return this.http.get(environment.BASE_API_URL + 'sections?auth_token=' + token + '&course_id=' + courseId);
  }

  public updateUserInfo(formData: any) {
    let body = `first_name=${formData.fullName}&mobile=${formData.mobile}&class=${formData.class}&school=${formData.school}&city=${formData.city}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    return this.http.post(environment.BASE_API_URL + 'update_user_data', body, httpOptions);
  }

  public downloadPdf(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  public savePdf(blob: Blob, fileName: string): void {
    saveAs(blob, fileName);
  }

  public downloadVideo(url: string, fileName: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (blob: any) => {
        // const blob = new Blob([data], { type: 'video/mp4' });
        saveAs(blob, fileName);
      }
    );
  }

  public saveVideo(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }

  public updateUserCurrentProgress(user_id: any, course_id: any, lesson_id: any) {
    let body = `user_id=${user_id}&course_id=${course_id}&lesson_id=${lesson_id}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post(environment.BASE_URL + 'home/update_watch_history_manually', body, httpOptions);
  }

  public getQuiz(lesson_id: any) {
    return this.http.get(environment.BASE_API_URL + 'quiz_questions_by_id?quiz_id=' + lesson_id);
  }

  public getQuizAttempt(quiz_id: any, user_id: any) {
    let body = `user_id=${user_id}&quiz_id=${quiz_id}`;

    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post(environment.BASE_API_URL + 'get_test_attempt', body, httpOptions);
  }

  public getTopicName(table: string, name: string) {
    return this.http.get(environment.BASE_API_URL + 'topic_name?table=' + table + '&name=' + name );
  }
  
  public getAllLiveClasses(token: string) {
    return this.http.get(environment.BASE_API_URL + 'all_live_classes?auth_token=' + token);
  }

  public getAndroidRatingLink() {
    return this.http.get(environment.BASE_API_URL + 'get_android_rating_link');
  }

  public getAndroidShareLink() {
    return this.http.get(environment.BASE_API_URL + 'get_android_share_link');
  }
  public getIosRatingLink() {
    return this.http.get(environment.BASE_API_URL + 'get_ios_rating_link');
  }

  public getIosShareLink() {
    return this.http.get(environment.BASE_API_URL + 'get_ios_share_link');
  }

  public getTestimonial() {
    return this.http.get(environment.BASE_API_URL + 'student_testimony');
  }

}
