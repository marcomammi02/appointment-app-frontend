import {Injectable} from "@angular/core";
import {ServiceDto} from "../dtos/services.dto";

@Injectable({
  providedIn: 'root'
})
export class ServicesStore {
  services: any = []

  currentService: any = {}

  durations = [
    {name: '15 min', minutes: 15},
    {name: '30 min', minutes: 30},
    {name: '45 min', minutes: 45},
    {name: '1 h', minutes: 60},
    {name: '1 h 15 min', minutes: 75},
    {name: '1 h 30 min', minutes: 90},
    {name: '1 h 45 min', minutes: 105},
    {name: '2 h', minutes: 120},
    {name: '2 h 15 min', minutes: 135},
    {name: '2 h 30 min', minutes: 150},
    {name: '2 h 45 min', minutes: 165},
    {name: '3 h', minutes: 180},
    {name: '3 h 15 min', minutes: 195},
    {name: '3 h 30 min', minutes: 210},
    {name: '3 h 45 min', minutes: 225},
    {name: '4 h', minutes: 240},
    {name: '4 h 15 min', minutes: 255},
    {name: '4 h 30 min', minutes: 270},
    {name: '4 h 45 min', minutes: 285},
    {name: '5 h', minutes: 300},
    {name: '5 h 15 min', minutes: 315},
    {name: '5 h 30 min', minutes: 330},
    {name: '5 h 45 min', minutes: 345},
    {name: '6 h', minutes: 360},
    {name: '6 h 15 min', minutes: 375},
    {name: '6 h 30 min', minutes: 390},
    {name: '6 h 45 min', minutes: 405},
    {name: '7 h', minutes: 420},
    {name: '7 h 15 min', minutes: 435},
    {name: '7 h 30 min', minutes: 450},
    {name: '7 h 45 min', minutes: 465},
    {name: '8 h', minutes: 480},
  ];
}
