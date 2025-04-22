import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { Business, Testimonial } from 'src/app/model/business-questions.model';
import { UploadService } from 'src/app/services/upload.service';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.css'],
    standalone: false
})
export class ReviewsComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  uploadProgress: { [key: string]: Observable<number | undefined> } = {};

  constructor(private fb: FormBuilder,
    private uploadService: UploadService,
  ) {}

  ngOnInit(): void {
    console.log("Reviews Admin Init");
    //this.initializeTestimonials();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['business'] && this.business) {
  //     console.log("Reviews page: - business", this.business);
  //     this.initializeTestimonials();
  //   }

  //   if (changes['businessId']) {
  //     console.log("Reviews page: - Business ID changed:", this.businessId);
  //     // Handle any logic related to businessId change if necessary
  //   }
  // }

  // private initializeTestimonials(): void {
  //   if (this.business?.testimonials) {
  //     this.business.testimonials.forEach(testimonial => {
  //       const testimonialForm = this.fb.group({
  //         id: [testimonial.id || ''],
  //         name: [testimonial.name || ''],
  //         quote: [testimonial.quote || ''],
  //         photoURL: [testimonial.photoURL || '']
  //       });
  //       this.testimonials.push(testimonialForm);
  //     });
  //   }
  // }


  populateTestimonials(testimonials: Testimonial[]): void {
    this.testimonials.clear();
    (testimonials ?? []).forEach((testimonial) => {
      const testimonialForm = this.fb.group({
        id: [testimonial.id],
        name: [testimonial.name],
        quote: [testimonial.quote],
        relationship: [testimonial.relationship],
        photoURL: [testimonial.photoURL]
      });
      this.testimonials.push(testimonialForm);
    });
  }

  get testimonials(): FormArray {
    return this.form.get('testimonials') as FormArray;
  }

  addTestimonial(): void {
    const testimonialForm = this.fb.group({
      id: [''],
      name: [''],
      relationship:[''],
      quote: [''],
      photoURL: ['']
    });
    this.testimonials.push(testimonialForm);
  }

  removeTestimonial(index: number): void {
    this.testimonials.removeAt(index);
  }

  onTestimonialFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, 'testimonail');

      this.uploadProgress[`testimonails_${index}`] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.testimonials.at(index).patchValue({ photoURL: url });
          });
        })
      ).subscribe();
    }
  }
}
