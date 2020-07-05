import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidators } from 'src/assets/custom.validators';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { ISkill } from './ISkill';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';
// import { matchEmail } from 'src/assets/match-email';

@Component({
  selector: 'app-createemployee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;
  validationsMessages = {
    fullName: {
      required: 'Full Name is required',
      minlength: 'Full Name must be greater than 2 characters',
      maxlength: 'Full Name must be less than 10 characters',
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email Domain should be pranjal.com',
    },
    confirmEmail: {
      required: 'Confirm Email is required.',
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm do not match',
    },
    phoneNumber: {
      required: 'Phone Number is required',
    },
  };
  formErrors = {
    fullName: '',
    email: '',
    confirmEmail: '',
    emailGroup: '',
    contactPreference: '',
    phoneNumber: '',
  };

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private employeeService: EmployeeService, private router: Router) { }

  ngOnInit() {

    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('gmail.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),
      phoneNumber: ['', Validators.required],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });
    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });
    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      }
      else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phoneNumber: null,
          skills: []
        };
      }
    });
  }
  // get request to rest api to retrieve data
  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (err: any) => console.log(err)
    );
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phoneNumber: employee.phoneNumber
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency

      }));
    });
    return formArray;
  }

  // skill button
  addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }
  // discard skill
  removeSkillButtonClick(addSkillFormGroupIndex: number): void {
    const skillFormArray = (this.employeeForm.get('skills') as FormArray);
    skillFormArray.removeAt(addSkillFormGroupIndex);
    skillFormArray.markAsDirty();
    skillFormArray.markAsTouched();
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({

      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }
  // contact preference validator
  onContactPreferenceChange(selectedValue: string) {
    const phoneNumberControl = this.employeeForm.get('phoneNumber');
    if (selectedValue === 'phoneNumber') {
      phoneNumberControl.setValidators(Validators.required);

    } else {
      phoneNumberControl.clearValidators();
    }
    phoneNumberControl.updateValueAndValidity();
  }
  // onContactPreferenceChange(selectedValue: string): {
  //   throw new Error("Method not implemented.");
  // }


  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.dirty ||
        abstractControl.touched) || abstractControl.value !== '') {
        const messages = this.validationsMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + '';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
  onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }
  //   this.employeeForm.setValue({
  //     fullName: 'pranjal sharma',
  //     email: 'pranjal0734@gmail.com',
  //     //  patch.Value() to update sub set of form controls
  //     //  setValue to update all form controls if we accidentally miss a value of form controls it will fails with an error
  //     skills: {
  //       skillName: 'java',
  //       experienceInYears: 4,
  //       proficiency: 'beginner'
  //     }
  //   });
  // }
  // save for both create nd update on submission
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
  }
  // mapping values from form to db.json in both create nd edit pages.
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phoneNumber = this.employeeForm.value.phoneNumber;
    this.employee.skills = this.employeeForm.value.skills;
  }
}
// email  and confirm email matching
function matchEmail(group: AbstractControl): {
  [key: string]: any;
} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value ||
    (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  }
  else {
    return { emailMismatch: true };
  }
}



