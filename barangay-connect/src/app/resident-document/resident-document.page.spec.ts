import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentDocumentPage } from './resident-document.page';

describe('ResidentDocumentPage', () => {
  let component: ResidentDocumentPage;
  let fixture: ComponentFixture<ResidentDocumentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentDocumentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
