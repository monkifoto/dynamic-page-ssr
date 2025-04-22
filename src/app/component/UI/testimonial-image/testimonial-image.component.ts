import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-testimonial-image',
    templateUrl: './testimonial-image.component.html',
    styleUrls: ['./testimonial-image.component.css'],
    standalone: false
})
export class TestimonialImageComponent {
  @Input() text: string= '';
  @Input() author: string ='';
  @Input() imageURL: string ='';

}
