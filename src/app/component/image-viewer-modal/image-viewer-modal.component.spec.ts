import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewerModalComponent } from './image-viewer-modal.component';

describe('ImageViewerModalComponent', () => {
  let component: ImageViewerModalComponent;
  let fixture: ComponentFixture<ImageViewerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageViewerModalComponent]
    });
    fixture = TestBed.createComponent(ImageViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
