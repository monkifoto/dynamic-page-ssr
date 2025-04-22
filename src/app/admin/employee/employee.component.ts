import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Observable } from 'rxjs';
import { Business, Employee } from 'src/app/model/business-questions.model';
import { UploadService } from 'src/app/services/upload.service';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css'],
    standalone: false
})
export class EmployeeComponent {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  uploadProgress: { [key: string]: Observable<number | undefined> } = {};

  constructor(private fb: FormBuilder,
    private uploadService: UploadService,
  ) {}


  get employees(): FormArray {
    return this.form.get('employees') as FormArray;
  }

  populateEmployees(employees: Employee[]): void {
    this.employees.clear();
    (employees ?? []).forEach((employee) => {
      const employeeForm = this.fb.group({
        id: [employee.id],
        name: [employee.name],
        role: [employee.role],
        bio: [employee.bio],
        photoURL: [employee.photoURL],
      });
      this.employees.push(employeeForm);
    });
  }

  addEmployee(): void {
    const employeeForm = this.fb.group({
      id: [''],
      name: [''],
      role: [''],
      bio: [''],
      photoURL: ['']
    });
    this.employees.push(employeeForm);
  }

  removeEmployee(index: number): void {
    this.employees.removeAt(index);
  }




  onEmployeeFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(file, this.businessId, 'employee');

      this.uploadProgress[`employee_${index}`] = uploadProgress;

      downloadUrl.pipe(
        finalize(() => {
          downloadUrl.subscribe(url => {
            this.employees.at(index).patchValue({ photoURL: url });
          });
        })
      ).subscribe();
    }
  }



}
