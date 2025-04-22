import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Business } from 'src/app/model/business-questions.model';

@Component({
    selector: 'app-contact-us-page',
    templateUrl: './contact-us-page.component.html',
    styleUrls: ['./contact-us-page.component.css'],
    standalone: false
})
export class ContactUsPageComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
    { url: 'assets/sharedAssets/istockphoto-478915838-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-480743801-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-502998071-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-613308420-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-653191338-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-655931804-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-804432288-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-912405752-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-918529390-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-941789670-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1097353864-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1170514008-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1307432717-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1319783351-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1335866199-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1432890664-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2012854188-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2032240867-2048x2048.jpg' },
    { url: 'assets/sharedAssets/5388429572_df9a403081_k.jpg' },
    { url: 'assets/sharedAssets/9676303919_32372bf834_o.jpg' },
  ];


  //to do: allow user to select one of the 5 images to show on the contact us page, or to upload a photos under the business dir and save the url to busines.contactUsImageUrl
  //to do also use the personalize contact us page message currently not used.

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Check if controls exist; if not, add them with default values
    if (!this.form.contains('contactUsImageUrl')) {
      this.form.addControl('contactUsImageUrl', this.fb.control(this.form.value.contactUsImageUrl || ''));
    }

    if (!this.form.contains('contactFormDetails')) {
      this.form.addControl('contactFormDetails', this.fb.control(this.form.value.contactFormDetails || ''));
    }
  }

  onImageSelection(url: string) {
    //console.log("Admin: Contact Us: onImageSelected: url: ", url)
    this.form.patchValue({
      contactUsImageUrl: url
    });
    if (this.business) {
      this.business.contactUsImageUrl = url;  // Save selected URL in business model
    }
  }

}
