import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-section-tilte',
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.css'],
    standalone: false
})
export class SectionTitleComponent {
  @Input() title!: string;
  @Input() titleColor: string = '#000000';
}
