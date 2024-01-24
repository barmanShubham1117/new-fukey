import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZoomMeetPage } from './zoom-meet.page';

describe('ZoomMeetPage', () => {
  let component: ZoomMeetPage;
  let fixture: ComponentFixture<ZoomMeetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ZoomMeetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
