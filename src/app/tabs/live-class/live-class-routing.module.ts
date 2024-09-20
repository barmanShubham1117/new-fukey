import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveClassPage } from './live-class.page';

const routes: Routes = [
  {
    path: '',
    component: LiveClassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveClassPageRoutingModule {}
