import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { StudyMaterialPageRoutingModule } from './study-material-routing.module';

import { StudyMaterialPage } from './study-material.page';
import { QuizComponent } from 'src/app/components/quiz/quiz.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';

import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudyMaterialPageRoutingModule,
    PdfViewerModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [StudyMaterialPage,QuizComponent],
  providers:[SQLite,File]
})
export class StudyMaterialPageModule {}
