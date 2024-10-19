import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityStore {
  week: any[] = [
    {name: 'Lunedì', value: 1},
    {name: 'Martedì', value: 2},
    {name: 'Mercoledì', value: 3},
    {name: 'Giovedì', value: 4},
    {name: 'Venerdì', value: 5},
    {name: 'Sabato', value: 6},
    {name: 'Domenica', value: 0},
  ]
}
