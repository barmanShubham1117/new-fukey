import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudyMaterialPageRoutingModule } from './study-material-routing.module';

import { StudyMaterialPage } from './study-material.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SafePipe } from 'src/app/safe.pipe';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudyMaterialPageRoutingModule,
    PdfViewerModule,
  ],
  declarations: [StudyMaterialPage,SafePipe],
  providers:[SQLite,File]
})
export class StudyMaterialPageModule {}
