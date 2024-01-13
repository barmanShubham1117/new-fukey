import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  public user = {
    name: '',
    class: '',
    city: '',
    mobile: '',
    school: '',
    image: '',
  };

  private MOBILE: any;
  private USER_ID: any;
  private selectedFile: any;

  constructor(
    private appService: AppService,
    private httpService: HttpService,
    private el: ElementRef
  ) { 
    this.USER_ID = localStorage.getItem("USER_ID");
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    console.log("Selected File: ", this.selectedFile);
    this.onUpload();
  }

  onUpload(): void {
    if (this.selectedFile) {
      // Call your image service to upload the file here

      if (this.selectedFile && this.USER_ID) {
          this.httpService.updateProfilePicture(this.selectedFile, this.USER_ID).subscribe((response: any) => {
            console.log(response);
          });
      }
    }
  }

  getMobileNumber() {
    setTimeout(() => {
      this.httpService.getUserViaMobile(this.MOBILE).subscribe((response: any) => {
        console.log(response);
        this.user.name = response.first_name;
        this.user.city = response.city;
        this.user.school = response.school;
        this.user.class = response.class;
        this.user.mobile = response.mobile;
        this.user.image = response.image;
        this.appService.dismissLoading();
      });
    }, 2000);
  }
  ngOnInit() {
    this.appService.showLoadingScreen('Loading..');
    this.MOBILE = localStorage.getItem("MOBILE");
    this.getMobileNumber();
  }

  onSubmit() {
    const fullName = this.el.nativeElement.querySelector("#fullName").value;  
    const std = this.el.nativeElement.querySelector("#class").value;  
    const school = this.el.nativeElement.querySelector("#school").value;  
    const city = this.el.nativeElement.querySelector("#city").value;
    const mobile = this.el.nativeElement.querySelector("#mobile").value;

    if (fullName == '' || fullName == null) {
      this.appService.presentToast('Full Name is required.', "bottom");
    } else if (std == '' || std == null) {
      this.appService.presentToast('Class is required.', "bottom");
    } else if (school == '' || school == null) {
      this.appService.presentToast('School is required.', "bottom");
    } else if (city == '' || city == null) {
      this.appService.presentToast('City is required.', "bottom");
    } else {
      const formData = {
        fullName: fullName,
        class: std,
        school: school,
        city: city,
        mobile: mobile
      }

      console.log(formData);
      
      formData.mobile = this.user.mobile;
      console.log(formData);
      // this.appService.showLoadingScreen('Updating your info..');
      this.httpService.updateUserInfo(formData).subscribe((response: any) => {
        // this.appService.dismissLoadingScreen();
        this.appService.presentToast(response.message, "bottom");
      });
    }
  }
}
