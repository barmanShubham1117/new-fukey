import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineDownloadsPageRoutingModule } from './offline-downloads-routing.module';

import { OfflineDownloadsPage } from './offline-downloads.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineDownloadsPageRoutingModule
  ],
  declarations: [OfflineDownloadsPage]
})
export class OfflineDownloadsPageModule {}
