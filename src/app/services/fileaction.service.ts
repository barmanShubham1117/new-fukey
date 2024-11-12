import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpService } from './http.service';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class FileActionService {
  constructor(
    private sqlite: SQLite,
    private httpService:HttpService,
    private appService:AppService
  ) {}

  downloadAndSavePDF(pdfUrl: string,title:string,desc:string,batchName:string,instructor_name:string,type:string) {
    const dbName = 'file_dadb.db';
    const tableName = 'offline_download_assets';
    const pdfColumnName = 'file_data';
    this.appService.showLoadingScreen('Downloading offline media..');
    this.httpService.downloadPdf(pdfUrl).subscribe(
          (blob: Blob) => {
            // this.httpService.savePdf(blob, "");
            this.sqlite.create({
                name: dbName,
                location: 'default',
              }).then((db: SQLiteObject) => {
                db.executeSql("CREATE TABLE IF NOT EXISTS "+tableName+" (id INTEGER PRIMARY KEY AUTOINCREMENT,title Text,"+pdfColumnName+" Text, desc Text,batchName Text,instructor_name Text,type Text)", [])
                  .then(() => {
                    db.executeSql("INSERT INTO "+tableName+" (title,"+pdfColumnName+",desc,batchName,instructor_name,type) VALUES (?,?,?,?,?,?)",[title,blob,desc,batchName,instructor_name,type])
                      .then(() => {
                        
                        this.appService.dismissLoading().then(() => {
                          this.appService.presentToast('PDF data saved in SQLite database','bottom');
                        });
                      })
                      .catch((error) => {
                        this.appService.dismissLoading().then(() => {
                          console.log('Error inserting PDF data into the table:' + error,'bottom');
                        });
                        
                      });
                  })
                  .catch((error) => {
                    
                    this.appService.dismissLoading().then(() => {
                      console.log('Error creating table:' + error);
                    });
                  });
              }).catch((error) => {
                
                this.appService.dismissLoading().then(() => {
                  console.log('Error opening SQLite database:' + error,'bottom');
                });
              });
          }
        );
  }
}