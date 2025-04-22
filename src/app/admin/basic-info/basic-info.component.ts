import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Business } from 'src/app/model/business-questions.model';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css'],
    standalone: false
})
export class BasicInfoComponent  implements OnChanges, OnInit{
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;


  ngOnInit() {
    //console.log('Form value on init:', this.form?.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['form']) {
     // console.log('Form changed:', this.form?.value);
    }
  }
}
