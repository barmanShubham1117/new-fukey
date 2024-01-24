import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterpipePipe } from './pipes/filterpipe.pipe';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    FilterpipePipe,
    SafePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FilterpipePipe,
    SafePipe
  ]
})
export class SharedModule { }