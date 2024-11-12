import { Injectable } from '@angular/core';
import { Capacitor, PluginListenerHandle, Plugins } from '@capacitor/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { AppService } from './app.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Directory, Filesystem, DownloadFileResult, DownloadFileOptions, DeleteFileOptions } from "@capacitor/filesystem";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private storage!: SQLiteObject;
  private tableName = "offline_download_assets";
  private tableName2 = "chats";
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
    private httpService: HttpService
    ) {
    if (Capacitor.getPlatform() !== 'web') {
      this.platform.ready().then(() => {
        this.sqlite
          .create({
            name: 'fukey_local_storage.db',
            location: 'default',
          })
          .then((db: SQLiteObject) => {
            this.storage = db;
            this.createTable();
            this.createChatTable();
          })
          .catch(e => console.log(e));
      });
    }
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

  private createChatTable() {
    this.storage.executeSql("CREATE TABLE IF NOT EXISTS " + this.tableName2 + " (id INTEGER PRIMARY KEY AUTOINCREMENT,notification_title Text, notification_body Text, notification_story Text, notification_image Text, timestamp varchar)", [])
      .then(() => {
        console.log("Chat Table created successfully.");
        
        this.isDbReady.next(true);
      })
      .catch(e => console.log(e));
  }

  // async insertRecord(notification_title: string, notification_body: string, category: string, timestamp: number) {}

  async insertMessage(notification_title: string, notification_body: string, notification_story: string, notification_image: string, timestamp: number) {
    try {
      await this.storage.executeSql('INSERT INTO ' + this.tableName2 + ' (notification_title, notification_body, notification_story, notification_image, timestamp) VALUES (?, ?, ?, ?, ?)', [notification_title, notification_body, notification_story, notification_image, timestamp]);
      console.log('Data inserted!');
      console.log('Data inserted successfully!');

    } catch (error: any) {
      console.error('Error inserting data:', error);
    }
  }

  async getAllMessages() {
    try {
      const data = await this.storage.executeSql('SELECT * FROM ' + this.tableName2, []);
      const rows = data.rows;

      for (let i = 0; i < rows.length; i++) {
        const rowData = rows.item(i);
        console.log('Record:', rowData);
      }
    } catch(error: any) {
      console.error('Error getting all messages:', error);
    }
  }

  async getLastMessage(category: string) {
    try {
      const data = await this.storage.executeSql('SELECT * FROM ' + this.tableName2 + ' WHERE category=? ORDER BY id DESC LIMIT 1', [category]);
      const rows = data.rows;

      if (rows.length > 0) {
        const rowData = rows.item(0);
        console.log(rowData);
        
        return rowData.notification_body;
      } else {
        return 'No new messages';
      }
    } catch(error: any) {
      console.error('Error getting all messages:', error);
    }
  }

  async getChats() {
    try {
      const data = await this.storage.executeSql('SELECT * FROM ' + this.tableName2 + ' WHERE id IN (SELECT MAX(id) FROM ' + this.tableName2 + ' GROUP BY notification_story);', []);
      const rows = data.rows;

      if (rows.length > 0) {     
        return rows;
      } else {
        return 'No new messages';
      }
    } catch(error: any) {
      console.error('Error getting all messages:', error);
    }
  }
  async getMessages(story: string) {
    try {
      const data = await this.storage.executeSql('SELECT * FROM ' + this.tableName2 + ' WHERE notification_story=? ORDER BY id DESC', [story]);
      const rows = data.rows;

      if (rows.length > 0) {     
        return rows;
      } else {
        return 'No new messages';
      }
    } catch(error: any) {
      console.error('Error getting all messages:', error);
    }
  }

  async clearChatTable() {
    try {
      await this.storage.executeSql(`DELETE FROM ${this.tableName2}`, []);
      console.log(`Table ${this.tableName2} emptied successfully!`);
    } catch (error: any) {
      console.error('Error clearing all messages:', error);
    }
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
  
  async deleteFile(filename: string) {
    const options: DeleteFileOptions = {
      path: filename,
      directory: Directory.Data,
    };

    await Filesystem.deleteFile(options).then(() => {
      this.appService.presentToast('File deleted successfully.','bottom');
    })    
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

  async deleteDownloadAsset(title: any, type: string) {

    const dataInfo = await this.storage
      .executeSql('SELECT * FROM ' + this.tableName + ' WHERE title = ? and type = ?', [title, type])
      .then((res) => {
        return {
          filename: res.rows.item(0).filename,
          status: 'Found'
        };
      })
      .catch((error) => {
        return {
          filename: '',
          status: 'Error'
        };
      });

      if (dataInfo.status === 'Found' && dataInfo.filename !== '') {
        console.log("DB Service: deleteDownloadAsset() response : ", dataInfo.filename);
        console.log("DB Service: deleteDownloadAsset() response : ", dataInfo.filename.substring(dataInfo.filename.lastIndexOf("/") + 1));

        this.deleteFile(dataInfo.filename.substring(dataInfo.filename.lastIndexOf("/") + 1));
      }
    

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

  async deleteDownloadAssetByBatchName(batchName: any, type: string) {
    let items: any[] = [];

    const dataInfo = await this.storage
      .executeSql('SELECT * FROM ' + this.tableName + ' WHERE batch_name = ? and type = ?', [batchName, type])
      .then((res) => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            let fileName = res.rows.item(i).fileName
            console.log("File Name", fileName);

            items.push({
              files : fileName
            });
            
            this.deleteFile(fileName.substring(fileName.lastIndexOf("/") + 1));
          }
        }

        return {
          files: items
        };
      })
      .catch((error) => {
        return {
          filename: '',
          status: 'Error'
        };
      });

      items.forEach((item) => {
        console.log("DB Service: deleteDownloadAssetByBatchName() response : ", item.fileName.substring(item.fileName.lastIndexOf("/") + 1));
      })
    

    return this.storage
      .executeSql('DELETE FROM ' + this.tableName + ' WHERE batch_name = ? and type = ?', [batchName, type])
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

  // async getAllRecords() {
  //   return this.storage
  //     .executeSql('SELECT * FROM ' + this.tableName + ' WHERE id NOT LIKE ?', [0])
  //     .then((res) => {
  //       let items: any[] = [];
  //       if (res.rows.length > 0) {
  //         for (var i = 0; i < res.rows.length; i++) {
  //           console.log("Batch Name", res.rows.item(i).batchName);
  //           items.push({
  //             id: res.rows.item(i).id,
  //             batchName: res.rows.item(i).batchName,
  //             instructor_name: res.rows.item(i).instructor_name,
  //             filename: res.rows.item(i).filename,
  //           });
  //         }
  //       }
  //       return items;
  //     });
  // }
}
