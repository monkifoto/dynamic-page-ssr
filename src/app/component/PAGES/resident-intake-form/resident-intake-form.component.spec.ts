import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentIntakeFormComponent } from './resident-intake-form.component';

describe('ResidentIntakeFormComponent', () => {
  let component: ResidentIntakeFormComponent;
  let fixture: ComponentFixture<ResidentIntakeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidentIntakeFormComponent]
    });
    fixture = TestBed.createComponent(ResidentIntakeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
