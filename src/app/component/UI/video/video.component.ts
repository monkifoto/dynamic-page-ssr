import { Component,Input } from '@angular/core';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css'],
    standalone: false
})
export class VideoComponent {
  @Input() videoSource: string = '';
  @Input() autoplay: boolean = false;
  @Input() controls: boolean = true;
  @Input() loop: boolean = false;
  @Input() muted: boolean = false;
}
