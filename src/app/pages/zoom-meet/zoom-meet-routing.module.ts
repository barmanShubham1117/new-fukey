import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZoomMeetPage } from './zoom-meet.page';

const routes: Routes = [
  {
    path: '',
    component: ZoomMeetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZoomMeetPageRoutingModule {}
