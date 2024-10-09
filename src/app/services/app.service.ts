import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private loading: any;
  currentLoading:any = null;

  constructor(
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  public async presentToast(msg: string, pos: "top" | "bottom" | "middle") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: pos,
    });
    toast.present();
  }

  public async showLoadingScreen(msg: string) {
    if (this.currentLoading != null) {
      this.currentLoading.dismiss();
  }
    this.currentLoading = await this.loadingCtrl.create({
      message: msg
  });

  return await this.currentLoading.present();
    //await this.loading.present();
  }

  public async dismissLoading() {
    if (this.currentLoading != null) {
      this.currentLoading = null;
      return await this.loadingCtrl.dismiss();
      
  }
  return;
  }
}
