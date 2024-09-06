import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityStore {
  week: any[] = [
    {name: 'Lunedì', value: 'monday'},
    {name: 'Martedì', value: 'tuesday'},
    {name: 'Mercoledì', value: 'wednesday'},
    {name: 'Giovedì', value: 'thursday'},
    {name: 'Venerdì', value: 'friday'},
    {name: 'Sabato', value: 'saturday'},
    {name: 'Domenica', value: 'sunday'},
  ]
}
