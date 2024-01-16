import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineDownloadsPageRoutingModule } from './offline-downloads-routing.module';

import { OfflineDownloadsPage } from './offline-downloads.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterpipePipe } from 'src/app/shared/pipes/filterpipe.pipe';

@NgModule({
    declarations: [OfflineDownloadsPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OfflineDownloadsPageRoutingModule,
        SharedModule
    ]
})
export class OfflineDownloadsPageModule {}
