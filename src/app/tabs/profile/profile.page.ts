import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public USERNAME: any;
  public USER_ID: any;
  public MOBILE: any;

  public user = {
    name: '',
    class: '',
    city: '',
    mobile: '',
    school: '',
    image: '',
  };

  constructor(
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.MOBILE = localStorage.getItem('MOBILE');
    this.httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
      console.log(response);
      this.USERNAME = response.first_name;

      this.user.image = response.image;
    })
  }

}
