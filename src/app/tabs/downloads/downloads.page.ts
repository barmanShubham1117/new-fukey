import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {

  type: string = "";
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.type = this.router.getCurrentNavigation()?.extras.state?.['type'];
  }

}
