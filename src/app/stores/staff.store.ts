import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StaffStore {
  staffList: any =  []
}

export interface Staff {
  id: string
  name: string
  lastname: string
  role: string
  image: string
}
