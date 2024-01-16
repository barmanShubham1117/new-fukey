import { CommonModule } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule]
})
export class IntroPage implements AfterViewInit {

  @ViewChild('swiperEx') swiperEx?: ElementRef<{ swiper: Swiper }>
  start: any;

  public USERID: any;
  public MOBILE: any;                                                                                                           

  constructor(
    public router: Router,
    private storageService: StorageService
  ) {
    this.start = 0;
  }

  ngAfterViewInit(): void {
    register();
  }

  swiperSlideChanged() {
    console.log('changed: ', this.swiperEx?.nativeElement.swiper.activeIndex);
    this.start = this.swiperEx?.nativeElement.swiper.activeIndex;
  }

  goNext() {
    // this.swiperEx?.nativeElement.swiper.slideNext(1000);
    // // console.log('changed: ', this.swiperEx?.nativeElement.swiper.activeIndex);
    // this.start = this.swiperEx?.nativeElement.swiper.activeIndex;
    console.log("Button pressed");
    this.storageService.getStorage('push_notification_token').then((data: any) => {
      console.log("TOKEN: ", data);
    });
    
  }

  skip() {
    this.swiperEx?.nativeElement.swiper.slideTo(2);
    this.start = 2;
  }

  navigateToTargetPage() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
