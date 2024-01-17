import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterpipePipe } from './pipes/filterpipe.pipe';

@NgModule({
  declarations: [
    FilterpipePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FilterpipePipe
  ]
})
export class SharedModule { }