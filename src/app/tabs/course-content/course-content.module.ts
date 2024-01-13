import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseContentPageRoutingModule } from './course-content-routing.module';

import { CourseContentPage } from './course-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseContentPageRoutingModule
  ],
  declarations: [CourseContentPage]
})
export class CourseContentPageModule {}
