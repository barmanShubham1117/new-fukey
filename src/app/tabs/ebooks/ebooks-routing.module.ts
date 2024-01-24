import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EbooksPage } from './ebooks.page';

const routes: Routes = [
  {
    path: '',
    component: EbooksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EbooksPageRoutingModule {}
