import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseContentPageRoutingModule } from './course-content-routing.module';

import { CourseContentPage } from './course-content.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseContentPageRoutingModule,
    SharedModule
  ],
  declarations: [CourseContentPage]
})
export class CourseContentPageModule {}
