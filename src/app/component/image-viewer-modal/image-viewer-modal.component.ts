import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-image-viewer-modal',
    templateUrl: './image-viewer-modal.component.html',
    styleUrls: ['./image-viewer-modal.component.css'],
    standalone: false
})
export class ImageViewerModalComponent {
  @Input() imageUrl!: string;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
