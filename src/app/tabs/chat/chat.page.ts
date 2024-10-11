import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { NavController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  private MOBILE: any = '';
  private SESSION_ID: any = '';

  public chats: any[] = [];

  public isFound: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private dbService: DbService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.MOBILE = localStorage.getItem("MOBILE");
    this.SESSION_ID = localStorage.getItem("SESSION_ID");
    this.getChats();
  }

  getChats() {
    console.log('getChats invoked');
    
    this.dbService.getChats().then((response: any) => {
      console.log(response);

      if (response.length > 0) {
        this.chats = [];
        for(let i = 0; i < response.length; i++) {
          console.log(response.item(i));
          this.chats.push(response.item(i));
        }
        
        this.isFound = true;
      } else {
        this.isFound = false;
      }
      console.log("isFound: " + this.isFound);
    });
  }

  // getClassNo(text: any) {
  //   const regex = /Class (\d+)/;
  //   const match = regex.exec(text)!;
  //   return match[1];
  // }

  // async getUserDetails() {
  //   if(localStorage.getItem('CLASS') == undefined) {
  //     this.httpService.getUserViaMobile(localStorage.getItem('MOBILE')!).subscribe((response: any) => {
  //       console.log('CHAT PAGE: ', response);
  //       this.CLASS_NO = this.getClassNo(response.class);
  //       localStorage.setItem('CLASS', response.class);
  //     });
  //   } else {
  //     this.CLASS_NO = this.getClassNo(localStorage.getItem('CLASS'));
  //   }
  //   this.CLASS = localStorage.getItem('CLASS')!;
  // }

  // async getEnrolledCourses() {
  //   this.httpService.getEnrolledCourses(localStorage.getItem('TOKEN')!).subscribe((response: any) => {
  //     this.enrolledCourses = response;
  //     this.enrolledCourses.forEach((course) => {
  //       console.log(course);
  //     });
      
  //   });
  // }

  // public getLastMessage(category: string) {
  //   this.dbService.getLastMessage(category).then((response: any) => {
  //     console.log(response);
      
  //     return response;
  //   });
  // }

  navigateToMessages(chat: string) {
    this.verifySession();
    
    const navigationExtras = {
      state: {
        story: chat
      },
      replaceUrl: false,
    };
    console.log(navigationExtras);
    this.router.navigate(['/tabs/chat/alerts'], navigationExtras);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getChats();
      event.target.complete();
    }, 2000);
  }

  // public showMessages() {
  //   this.dbService.getLastMessage('dummy').then((response: any) => {
  //     console.log("Messages loaded");
  //     console.log(response);
  //   });
  // }
  // public deleteMessages() {
  //   this.dbService.clearChatTable().then(() => {
  //     console.log("Messages deleted");
  //   });
  // }

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
