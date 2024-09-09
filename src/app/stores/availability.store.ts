import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityStore {
  week: any[] = [
    {name: 'Lunedì', value: 0},
    {name: 'Martedì', value: 1},
    {name: 'Mercoledì', value: 2},
    {name: 'Giovedì', value: 3},
    {name: 'Venerdì', value: 4},
    {name: 'Sabato', value: 5},
    {name: 'Domenica', value: 6},
  ]
}
