import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SafePipe } from 'src/app/safe.pipe';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';
import { OfflineMaterialPageRoutingModule } from './offline-material-routing.module';
import { OfflineMaterialPage } from './offline-material.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineMaterialPageRoutingModule,
    PdfViewerModule,
  ],
  declarations: [OfflineMaterialPage],
  providers:[SQLite,File]
})
export class OfflineMaterialPageModule {}
