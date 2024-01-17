import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudyMaterialPageRoutingModule } from './study-material-routing.module';

import { StudyMaterialPage } from './study-material.page';
import { QuizComponent } from 'src/app/components/quiz/quiz.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SafePipe } from 'src/app/safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudyMaterialPageRoutingModule,
    PdfViewerModule,
  ],
  declarations: [StudyMaterialPage,SafePipe,QuizComponent],
})
export class StudyMaterialPageModule {}
