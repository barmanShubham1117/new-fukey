import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TncPageRoutingModule } from './tnc-routing.module';

import { TncPage } from './tnc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TncPageRoutingModule
  ],
  declarations: [TncPage]
})
export class TncPageModule {}
