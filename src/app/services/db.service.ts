import { Injectable } from '@angular/core';
import { PluginListenerHandle, Plugins } from '@capacitor/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpService } from './http.service';
import { AppService } from './app.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FileOpener } from "@capacitor-community/file-opener";
import { Platform } from '@ionic/angular';
import { Directory, Filesystem, DownloadFileResult, DownloadFileOptions } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private storage!: SQLiteObject;
  private tableName = "offline_download_assets";
  private downloadAssets = new BehaviorSubject([]);
  private fileAssets = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private downloadProgress = 0;
  private downloadUrl = "";
  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private appService: AppService,
    private httpService: HttpService,
    private file: File
  ) {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: 'fukey_local_storage.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.createTable();
        })
        .catch(e => console.log(e));
    });
  }
  dbState() {
    return this.isDbReady.asObservable();
  }
  private createTable() {
    this.storage.executeSql("CREATE TABLE IF NOT EXISTS " + this.tableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT,title Text,filename TEXT, desc Text,batchName Text,instructor_name Text,type Text)", [])
      .then(() => {
        this.isDbReady.next(true);
      })
      .catch(e => console.log(e));
  }
  async downloadFile(url: string, title: string, desc: string, batchName: string, instructor_name: string, type: string):Promise<Observable<any>> {
      this.downloadUrl = url ? url : this.downloadUrl;
    const name = this.downloadUrl.substring(this.downloadUrl.lastIndexOf("/") + 1);
    const progress = await Filesystem.addListener('progress', progress => {
      this.downloadProgress = Math.round((progress.bytes / progress.contentLength) * 100);
    });
    const options: DownloadFileOptions = {
      url: this.downloadUrl,
      path: name,
      progress: true,
      directory: Directory.Data,
      responseType: "blob" as "blob",
      webFetchExtra: { mode: 'no-cors' as RequestMode }
    };

    try {
      const response: DownloadFileResult = await Filesystem.downloadFile(options)
      const path = response.path as string;
      this.appService.presentToast('File saved successfully.','bottom');
      return new Observable(observer =>{
        this.storage.executeSql("INSERT INTO " + this.tableName + " (title,filename,desc,batchName,instructor_name,type) VALUES (?,?,?,?,?,?)", [title, path, desc, batchName, instructor_name, type])
          .then(() => {
            this.appService.dismissLoading().then(() => {
              observer.next("done");
            });
          })
          .catch((error) => {
            this.appService.dismissLoading().then(() => {
              console.log('Error inserting media data into the table:' + error, 'bottom');
              observer.next("error");
            });

          });
      });
      
    } catch (e) {
      return new Observable(observer =>{
      console.log(e);
      this.appService.presentToast('Error to download media.','bottom');
      this.cleanupDownload(progress);
      observer.next("error");
      });
    }

    
  }

  cleanupDownload(progress: PluginListenerHandle) {
    this.downloadProgress = 0;
    progress.remove();
  }
getDownloadAssets(type: string) : Promise < any[] > {
  return this.storage
    .executeSql('SELECT * FROM ' + this.tableName + ' where type=? group by batchName', [type])
    .then((res) => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          console.log("Batch Name", res.rows.item(i).batchName);
          items.push({
            id: res.rows.item(i).id,
            batchName: res.rows.item(i).batchName,
            instructor_name: res.rows.item(i).instructor_name,
          });
        }
      }
      return items;
    });
}
getDownloadAssetsByBatchName(batchName: string, type: string) : Promise < any[] > {
  return this.storage
    .executeSql('SELECT * FROM ' + this.tableName + ' where batchName=? and type=?', [batchName, type])
    .then((res) => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {

          items.push({
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,
            batchName: res.rows.item(i).batchName,
            instructor_name: res.rows.item(i).instructor_name,
            type: res.rows.item(i).type
          });
        }
      }
      return items;
    });
}
getDownloadAsset(title: any, type: string): Promise < object > {
  return this.storage
    .executeSql('SELECT * FROM ' + this.tableName + ' WHERE title = ? and type = ?', [title, type])
    .then((res) => {
      return {
        id: res.rows.item(0).id,
        title: res.rows.item(0).title,
        filename: res.rows.item(0).filename,
        blob_type: res.rows.item(0).blob_type,
        desc: res.rows.item(0).desc,
        batchName: res.rows.item(0).batchName,
        instructor_name: res.rows.item(0).instructor_name,
        type: res.rows.item(0).type,
        status: 'Found'
      };
    })
    .catch((error) => {
      return {
        status: 'Error'
      };
    });
}
deleteDownloadAsset(title: any, type: string): Promise < object > {
  return this.storage
    .executeSql('DELETE FROM ' + this.tableName + ' WHERE title = ? and type = ?', [title, type])
    .then((_) => {
      return {
        status: 'Deleted'
      };
    })
    .catch((error) => {
      return {
        status: 'Error'
      };
    });
}
}
