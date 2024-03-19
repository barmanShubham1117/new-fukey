import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  private MOBILE: string = '';
  public CLASS: string = '';
  public CLASS_NO: string = '';
  public enrolledCourses: any[] = [];

  constructor(
    private router: Router,
    private httpService: HttpService,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.getUserDetails();
    this.getEnrolledCourses();
  }

  getClassNo(text: any) {
    const regex = /Class (\d+)/;
    const match = regex.exec(text)!;
    return match[1];
  }

  async getUserDetails() {
    if(localStorage.getItem('CLASS') == undefined) {
      this.httpService.getUserViaMobile(localStorage.getItem('MOBILE')!).subscribe((response: any) => {
        console.log('CHAT PAGE: ', response);
        this.CLASS_NO = this.getClassNo(response.class);
        localStorage.setItem('CLASS', response.class);
      });
    } else {
      this.CLASS_NO = this.getClassNo(localStorage.getItem('CLASS'));
    }
    this.CLASS = localStorage.getItem('CLASS')!;
  }

  async getEnrolledCourses() {
    this.httpService.getEnrolledCourses(localStorage.getItem('TOKEN')!).subscribe((response: any) => {
      this.enrolledCourses = response;
      this.enrolledCourses.forEach((course) => {
        console.log(course);
      });
      
    });
  }

  public getLastMessage(category: string) {
    this.dbService.getLastMessage(category).then((response: any) => {
      console.log(response);
      
      return response;
    });
  }

  navigateToMessages() {
    this.router.navigate(['/tabs/chat/alerts']);
  }

  public showMessages() {
    this.dbService.getLastMessage('dummy').then((response: any) => {
      console.log("Messages loaded");
      console.log(response);
    });
  }
  public deleteMessages() {
    this.dbService.clearChatTable().then(() => {
      console.log("Messages deleted");
    });
  }

}
