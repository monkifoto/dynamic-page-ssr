import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpGalleryComponentComponent } from './sp-gallery-component.component';

describe('SpGalleryComponentComponent', () => {
  let component: SpGalleryComponentComponent;
  let fixture: ComponentFixture<SpGalleryComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpGalleryComponentComponent]
    });
    fixture = TestBed.createComponent(SpGalleryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
