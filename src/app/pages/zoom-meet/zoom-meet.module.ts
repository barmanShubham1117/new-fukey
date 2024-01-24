import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZoomMeetPageRoutingModule } from './zoom-meet-routing.module';

import { ZoomMeetPage } from './zoom-meet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZoomMeetPageRoutingModule
  ],
  declarations: [ZoomMeetPage]
})
export class ZoomMeetPageModule {}
