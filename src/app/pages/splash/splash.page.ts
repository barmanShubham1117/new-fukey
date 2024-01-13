import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    public router: Router,
    public httpService: HttpService
  ) {
    setTimeout(() => {
      if (httpService.USER_ID == undefined || httpService.MOBILE == undefined || httpService.TOKEN == undefined) {
        localStorage.clear();
        this.router.navigate(['/intro'], { replaceUrl: true });
      } else {
        this.router.navigate(['/tabs'], { replaceUrl: true });
      }
    }, 5000)
   }

  ngOnInit() {
  }

}
