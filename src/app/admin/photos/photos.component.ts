import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { Business } from 'src/app/model/business-questions.model';
import { UploadService } from 'src/app/services/upload.service';

@Component({
    selector: 'app-photos',
    templateUrl: './photos.component.html',
    styleUrls: ['./photos.component.css'],
    standalone: false
})
export class PhotosComponent implements OnInit{
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;
  uploadProgress: { [key: string]: Observable<number | undefined> } = {};

  constructor(private fb: FormBuilder,
    private uploadService: UploadService,
  ) {

  }
  ngOnInit(): void {
    //console.log("Admin Photos business obj:", this.business);
  }


  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      let location: 'gallery' | 'employee' | 'business' | 'testimonail' | 'heroImages';

      // Determine location based on the field
      if (field === 'photoGallery') {
        location = 'gallery';
      } else if (field === 'testimonial') {
          location = 'business';
      } else if (field === 'logoImage' || field === 'facilityImages' || field === 'lifestyleImages') {
        location = 'business';
      }  else if (field === 'heroImages' ) {
        location = 'heroImages';
      } else {
        location = 'employee';
      }

      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, location);

      this.uploadProgress[field] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.form.patchValue({ [field]: url });
          });
        })
      ).subscribe();
    }
  }


}
