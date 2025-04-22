import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsPageComponent } from './section-manager.component';

describe('AboutUsPageComponent', () => {
  let component: AboutUsPageComponent;
  let fixture: ComponentFixture<AboutUsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUsPageComponent]
    });
    fixture = TestBed.createComponent(AboutUsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
