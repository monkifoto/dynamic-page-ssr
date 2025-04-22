import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurServicesHomeComponent } from './our-services-home.component';

describe('OurServicesHomeComponent', () => {
  let component: OurServicesHomeComponent;
  let fixture: ComponentFixture<OurServicesHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurServicesHomeComponent]
    });
    fixture = TestBed.createComponent(OurServicesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
