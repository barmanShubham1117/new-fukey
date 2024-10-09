import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private loading: any;

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
    this.loading = await this.loadingCtrl.create({
      message: msg
    });
    await this.loading.present();
  }

  public async dismissLoading() {
      await this.loading.dismiss();
  }
}
