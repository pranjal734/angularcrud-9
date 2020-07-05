import { AbstractControl } from '@angular/forms';
// validator for domain name checking
export class CustomValidators {
    static emailDomain(domainName: string) {
        return (control: AbstractControl): { [Key: string]: any } | null => {
            const email: string = control.value;
            const domain = email?.substring(email.lastIndexOf('@') + 1);

            if (email === '' || domain?.toLowerCase() === domainName?.toLowerCase()) {
                return null;

            }
            else {
                return { emailDomain: true };
            }
        };
    }
}
