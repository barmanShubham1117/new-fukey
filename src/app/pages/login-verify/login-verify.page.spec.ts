import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginVerifyPage } from './login-verify.page';

describe('LoginVerifyPage', () => {
  let component: LoginVerifyPage;
  let fixture: ComponentFixture<LoginVerifyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginVerifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
