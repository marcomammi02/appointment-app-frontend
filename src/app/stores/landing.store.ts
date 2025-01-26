import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LandingStore {
  links: string[] = [
    'Prezzi',
    'Features',
    'FAQ',
    'Recensioni',
  ]
}
