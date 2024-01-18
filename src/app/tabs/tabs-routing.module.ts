import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'batches',
        children: [
          {
            path: '',
            loadChildren: () => import('./batches/batches.module').then( m => m.BatchesPageModule)
          }
        ]
      },
      {
        path: 'batches/course-content',
        children: [
          {
            path: '',
            loadChildren: () => import('./course-content/course-content.module').then( m => m.CourseContentPageModule)
          }
        ]
      },
      {
        path: 'batches/course-content/study-material',
        children: [
          {
            path: '',
            loadChildren: () => import('./study-material/study-material.module').then( m => m.StudyMaterialPageModule)
          }
        ]
      },
      {
        path: 'zoom-non-login',
        loadChildren: () => import('./zoom-non-login/zoom-non-login.module').then(m => m.NonLoginModule)
      },
      {
        path: 'store',
        loadChildren: () => import('./store/store.module').then( m => m.StorePageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
      },
      {
        path: 'offline-downloads',
        loadChildren: () => import('./offline-downloads/offline-downloads.module').then( m => m.OfflineDownloadsPageModule)
      },
      {
        path: 'offline-downloads/downloads',
        loadChildren: () => import('./downloads/downloads.module').then( m => m.DownloadsPageModule)
      },
      {
        path: 'offline-downloads/offline-material',
        loadChildren: () => import('./offline-material/offline-material.module').then( m => m.OfflineMaterialPageModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/tabs/home',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}