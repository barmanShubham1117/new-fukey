import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
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
  providers:[SQLite]
})
export class OfflineMaterialPageModule {}
