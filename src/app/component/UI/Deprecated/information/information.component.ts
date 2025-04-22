import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css'],
    standalone: true,
    imports:[CommonModule]
})
export class InformationComponent {
  @Input() phoneNumber!: string;
  @Input() address!: string;
  @Input() email!: string;
}
