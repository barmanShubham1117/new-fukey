import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineDownloadsPage } from './offline-downloads.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineDownloadsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineDownloadsPageRoutingModule {}
