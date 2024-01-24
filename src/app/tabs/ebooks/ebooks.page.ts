import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-ebooks',
  templateUrl: './ebooks.page.html',
  styleUrls: ['./ebooks.page.scss'],
})
export class EbooksPage implements OnInit {

  private TOKEN: any = '';
  private USER_ID: any = '';
  private MOBILE: any = '';
  
  public ebooks: any;
  public newEBooks: any;
  public isStudyMaterialsAvailable: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.httpService.getAllEbooks().subscribe((response: any) => {
      console.log("EBOOKS PAGE: getAllEbooks(): ", response);
      
      this.ebooks = response;
      if (this.ebooks.length > 0) {
        this.isStudyMaterialsAvailable = true;
      }
    });
  }

  createSubarrays() {
    const originalLength = this.ebooks.length;

    for (let i = 0; i < originalLength; i += 2) {
      const subArray = this.ebooks.slice(i, i + 2);
      this.newEBooks.push(subArray);
    }
    console.log('NEW ARRAY: ', this.newEBooks);
  }
}
