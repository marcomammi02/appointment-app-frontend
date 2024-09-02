import {Injectable} from "@angular/core";

export interface MyError {
  label: string
  message: string
}
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errors: MyError[] = []

  showError(error: MyError) {
    this.errors.push(error)
    setTimeout(() => {
      this.resetErrors();
    }, 3000);
  }


  resetErrors() {
    this.errors = []
  }
}
