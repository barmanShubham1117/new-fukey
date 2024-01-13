import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginVerifyPageRoutingModule } from './login-verify-routing.module';

import { LoginVerifyPage } from './login-verify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginVerifyPageRoutingModule
  ],
  declarations: [LoginVerifyPage]
})
export class LoginVerifyPageModule {}
