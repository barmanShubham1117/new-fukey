import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit {

  public story: any;
  public messages: any[] = [];

  constructor(
    private router: Router,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.story = this.router.getCurrentNavigation()?.extras.state?.['story'];
    console.log(this.story);

    this.getMessages();
  }

  getMessages() {
    this.dbService.getMessages(this.story).then((response: any) => {
      console.log("response");
      console.log(response);
      this.messages = [];
      for(let i = 0; i < response.length; i++) {
        console.log(i);
        console.log(response.item(i));
        response.item(i).timestamp = this.formatTimestamp(response.item(i).timestamp)
        this.messages.push(response.item(i));
      }

      console.log("this.messages");
      console.log(this.messages);
      
    });
  } 

  formatTimestamp(unixTimestamp: number) {
    // Create a new Date object from the timestamp in milliseconds
    const date = new Date(unixTimestamp * 1000);
    date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000));
  
    // Fallback for browsers without toLocaleString options support
    if (!Date.prototype.toLocaleDateString) {
      const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // Use 12-hour format
      };
      // Use toLocaleString (without options) for unsupported browsers
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-IN', { hour12: true });
    }

    // Use toLocaleString with options for modern browsers
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // Use 12-hour format
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getMessages();
      event.target.complete();
    }, 2000);
  }

}
