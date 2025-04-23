import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Business } from '../../model/business-questions.model';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css'],
    standalone: true,
    imports:[CommonModule, FormsModule, ReactiveFormsModule]
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
