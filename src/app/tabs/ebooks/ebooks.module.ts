import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EbooksPageRoutingModule } from './ebooks-routing.module';

import { EbooksPage } from './ebooks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EbooksPageRoutingModule
  ],
  declarations: [EbooksPage]
})
export class EbooksPageModule {}
