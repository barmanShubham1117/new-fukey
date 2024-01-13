import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginVerifyPage } from './login-verify.page';

const routes: Routes = [
  {
    path: '',
    component: LoginVerifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginVerifyPageRoutingModule {}
