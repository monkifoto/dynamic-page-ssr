import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-section-title', // Corrected the selector name
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class SectionTitleComponent {
  @Input() title!: string;
  @Input() titleColor: string = '#000000';
}
