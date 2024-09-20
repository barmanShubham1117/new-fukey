import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveClassPage } from './live-class.page';

describe('LiveClassPage', () => {
  let component: LiveClassPage;
  let fixture: ComponentFixture<LiveClassPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LiveClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
