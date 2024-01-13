import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineDownloadsPage } from './offline-downloads.page';

describe('OfflineDownloadsPage', () => {
  let component: OfflineDownloadsPage;
  let fixture: ComponentFixture<OfflineDownloadsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OfflineDownloadsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
