import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicThemeLoaderComponent } from './dynamic-theme-loader.component';

describe('DynamicThemeLoaderComponent', () => {
  let component: DynamicThemeLoaderComponent;
  let fixture: ComponentFixture<DynamicThemeLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicThemeLoaderComponent]
    });
    fixture = TestBed.createComponent(DynamicThemeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
