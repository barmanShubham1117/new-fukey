import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterVerifyPageRoutingModule } from './register-verify-routing.module';

import { RegisterVerifyPage } from './register-verify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterVerifyPageRoutingModule
  ],
  declarations: [RegisterVerifyPage]
})
export class RegisterVerifyPageModule {}
