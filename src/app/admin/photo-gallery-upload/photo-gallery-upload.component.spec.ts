import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGalleryUploadComponent } from './photo-gallery-upload.component';

describe('PhotoGalleryUploadComponent', () => {
  let component: PhotoGalleryUploadComponent;
  let fixture: ComponentFixture<PhotoGalleryUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoGalleryUploadComponent]
    });
    fixture = TestBed.createComponent(PhotoGalleryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
