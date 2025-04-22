
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntakeForm } from 'src/app/model/intake-form.model';
import { IntakeService } from 'src/app/services/intake.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { EmailService } from 'src/app/services/email.service';
// import { Modal } from 'bootstrap';
import { MetaService } from 'src/app/services/meta-service.service';
import { Business } from 'src/app/model/business-questions.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-resident-intake-form',
    templateUrl: './resident-intake-form.component.html',
    styleUrls: ['./resident-intake-form.component.css'],
    standalone: false
})
export class ResidentIntakeFormComponent implements OnInit {
  businessId: string | null = null;
  business: Business | null = null;

    layoutType: string | undefined = 'demo';
  intakeForm: FormGroup;
  modalTitle: string = '';
    modalMessage: string = '';
    // responseModal!: Modal; // Modal instance

  constructor(private fb: FormBuilder, private intakeService: IntakeService,
    private businessDataService: BusinessDataService,
    private emailService: EmailService,
    private metaService: MetaService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  )
    {

    this.intakeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      referralSource: ['', Validators.required],
      relationToResident: [''],
      residentName: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      medicalHistory: [''],
      height: [''],
      weight: [''],
      reasonForMoving: [''],
      rnAssessment: [''],
      eating: [''],
      personalHygiene: [''],
      bathing: [''],
      toileting: [''],
      mobility: [''],
      transfers: [''],
      medicationAssistance: [''],
      memoryIssues: [''],
      behavior: [''],
      skinCondition: [''],
      additionalInfo: [''],
      currentLivingSituation: [''],
      targetMoveInDate: [''],
      disclosureSummary: [''],
      questions: ['']
    });
  }
  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      window.history.replaceState({}, '', this.router.url.split('?')[0]);
    }


    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;

      if (business?.id) {
        // this.metaService.loadAndApplyMeta(business?.id);
        this.layoutType = this.business?.theme.themeType;
        this.businessId = this.business?.id || '';
      }
    });
  }

  onSubmit() {
    if (this.intakeForm.valid) {
      const formData: IntakeForm = this.intakeForm.value;
      console.log(this.intakeForm.value);
      if(this.businessId)
      this.intakeService.saveIntakeForm(formData, this.businessId ).subscribe(
        response => {
          console.log('Intake form saved successfully!', response);
        },
        error => {
          console.error('Error saving intake form:', error);
        }
      );

      // Construct the payload to match the expected structure
      const emailPayload = {
        name: formData.name,
        email: formData.email,
        message: this.generateEmailMessage(formData),
        website: isPlatformBrowser(this.platformId) ? window.location.hostname : ''
      };

      // Send the email
      this.emailService.sendEmail(emailPayload).subscribe(
        response => {
          this.modalTitle = 'Form Submitted';
          this.modalMessage = 'Thank you for submitting the form! We will get back to you soon.';
          // Show modal or display a success message
        },
        error => {
          console.error('Error sending email', error);
          this.modalTitle = 'Error';
          this.modalMessage = 'There was an issue submitting the form. Please try again later.';
          // Show modal or display an error message
        }
      );
    }
  }

  // Helper method to generate a formatted message
  private generateEmailMessage(formData: any): string {
    return `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone Number: ${formData.phoneNumber}
      Referral Source: ${formData.referralSource}
      Relation to Resident: ${formData.relationToResident}
      Resident Name: ${formData.residentName}
      Age: ${formData.age}
      Gender: ${formData.gender}
      Medical History: ${formData.medicalHistory}
      Height: ${formData.height}
      Weight: ${formData.weight}
      Reason for Moving: ${formData.reasonForMoving}
      RN Assessment: ${formData.rnAssessment}
      Eating: ${formData.eating}
      Personal Hygiene: ${formData.personalHygiene}
      Bathing: ${formData.bathing}
      Toileting: ${formData.toileting}
      Mobility: ${formData.mobility}
      Transfers: ${formData.transfers}
      Medication Assistance: ${formData.medicationAssistance}
      Memory Issues: ${formData.memoryIssues}
      Behavior: ${formData.behavior}
      Skin Condition: ${formData.skinCondition}
      Additional Info: ${formData.additionalInfo}
      Current Living Situation: ${formData.currentLivingSituation}
      Target Move-In Date: ${formData.targetMoveInDate}
      Disclosure Summary: ${formData.disclosureSummary}
      Questions: ${formData.questions}
    `;
  }

}
