import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineMaterialPage } from './offline-material.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineMaterialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineMaterialPageRoutingModule {}
