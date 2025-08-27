import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegistrationPage } from './admin-registration.page';

describe('AdminRegistrationPage', () => {
  let component: AdminRegistrationPage;
  let fixture: ComponentFixture<AdminRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
