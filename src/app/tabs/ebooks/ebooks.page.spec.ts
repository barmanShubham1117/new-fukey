import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EbooksPage } from './ebooks.page';

describe('EbooksPage', () => {
  let component: EbooksPage;
  let fixture: ComponentFixture<EbooksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EbooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
