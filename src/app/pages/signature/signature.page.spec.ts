import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignaturePage } from './signature.page';

describe('SignaturePage', () => {
  let component: SignaturePage;
  let fixture: ComponentFixture<SignaturePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
