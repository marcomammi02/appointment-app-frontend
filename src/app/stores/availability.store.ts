import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityStore {
  week: string[] = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica'
  ]

  hours: string[] = [
    '00:00',
  ]
}
