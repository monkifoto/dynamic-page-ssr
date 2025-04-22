import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css'],
    standalone: false
})
export class InformationComponent {
  @Input() phoneNumber!: string;
  @Input() address!: string;
  @Input() email!: string;
}
