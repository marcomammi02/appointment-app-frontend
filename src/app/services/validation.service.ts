import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

@Injectable ({
  providedIn: 'root'
})

export class ValidationService {

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

    const value = control.value;

    if (value && !emailRegex.test(value)) {
      return { invalidEmail: true };
    }

    return null;
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    const value = control.value;

    if (value && !phoneRegex.test(value)) {
      return { invalidPhone: true };
    }

    return null;
  }

  static checkPasswords(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }
}
