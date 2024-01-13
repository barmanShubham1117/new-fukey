import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseContentPage } from './course-content.page';

const routes: Routes = [
  {
    path: '',
    component: CourseContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseContentPageRoutingModule {}
