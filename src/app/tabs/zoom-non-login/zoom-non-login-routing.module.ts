import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonLoginPage } from './zoom-non-login.page';

const routes: Routes = [
  {
    path: '',
    component: NonLoginPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonLoginRoutingModule {}
