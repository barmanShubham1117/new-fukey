import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveClassPageRoutingModule } from './live-class-routing.module';

import { LiveClassPage } from './live-class.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveClassPageRoutingModule
  ],
  declarations: [LiveClassPage]
})
export class LiveClassPageModule {}
