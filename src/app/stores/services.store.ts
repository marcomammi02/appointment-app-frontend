import {Injectable} from "@angular/core";
import {ServiceDto} from "../dtos/services.dto";

@Injectable({
  providedIn: 'root'
})
export class ServicesStore {
  services: any = []
}
