import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, ListItem } from 'src/app/model/business-questions.model';

@Component({
    selector: 'app-services-page',
    templateUrl: './services-page.component.html',
    styleUrls: ['./services-page.component.css'],
    standalone: false
})
export class ServicesPageComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;
  newServiceForm!: FormGroup;
  newBenefitsForm!: FormGroup;

  collapsedServices: boolean[] = [];
  collapsedBenefits: boolean[] = [];

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (!this.form.controls['services']) {
      this.form.addControl('services', this.fb.array([]));
    }
    if (!this.form.controls['benefits']) {
      this.form.addControl('benefits', this.fb.array([]));
    }
    // Initialize serviceForm with necessary fields
    this.newServiceForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''],
      description:[]

    });

    // Initialize benefitsForm with necessary fields
    this.newBenefitsForm = this.fb.group({
      name: ['', Validators.required],
      icon: [''],
      description:[]
    });
    this.initializeCollapsedStates();
  }

  populateServices(services: ListItem[]): void {

    this.services.clear();
    (services ?? []).forEach((svc) => {
      const servicesForm = this.fb.group({
        name: [svc.name],
        icon: [svc.icon],
        description:[svc.description]
      });
      this.services.push(servicesForm);
    });
    this.initializeCollapsedStates();
  }

  populateBenefits(benefits: ListItem[]): void {
    this.benefits.clear();
    (benefits ?? []).forEach((bnf) => {
      const benefitsFormForm = this.fb.group({
        name: [bnf.name],
        icon: [bnf.icon],
        description:[bnf.description]
      });
      this.benefits.push(benefitsFormForm);
    });
  }


  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  get benefits(): FormArray {
    return this.form.get('benefits') as FormArray;
  }

  initializeCollapsedStates() {
    this.collapsedServices = new Array(this.services.length).fill(true);
    this.collapsedBenefits = new Array(this.benefits.length).fill(true);
  }

  toggleService(index: number): void {
    if (index >= 0 && index < this.collapsedServices.length) {
      this.collapsedServices[index] = !this.collapsedServices[index];
    }
  }

  toggleBenefit(index: number): void {
    if (index >= 0 && index < this.collapsedBenefits.length) {
      this.collapsedBenefits[index] = !this.collapsedBenefits[index];
    }
  }

  addService() {
    const serviceGroup = this.fb.group({
      name: [''],
      icon: [''],
      description: ['']
    });

    this.services.insert(0, serviceGroup);  // Insert at index 0

    this.collapsedServices.unshift(false);  // Add collapsed state to the top
    this.cdRef.detectChanges();
  }



  removeService(index: number): void {
    this.services.removeAt(index);
  }

  addBenefit() {
    const benefitGroup = this.fb.group({
      name: [''],  // No validation at this stage
      icon: [''],
      description: ['']
    });

    this.benefits.insert(0, benefitGroup);  // Insert at index 0
    this.collapsedBenefits.unshift(true);  // Add collapsed state to the top
    this.cdRef.detectChanges();
  }



  removeBenefit(index: number): void {
    this.benefits.removeAt(index);
  }


}
