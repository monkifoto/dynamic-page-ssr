import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'app-text-wrapper',
    template: `<div class="text-wrapper"><ng-template #wrapperContainer></ng-template></div>`,
    styleUrls: ['./text-wrapper.component.css'],
    standalone: true,
    imports:[CommonModule]
})
export class TextWrapperComponent {
  @ViewChild('wrapperContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
}
