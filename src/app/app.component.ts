import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from 'primeng/toast';
import {ErrorService} from "./services/error.service";
import {MessageService, PrimeNGConfig} from "primeng/api";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FloatLabelModule, InputTextModule, ToastModule, TranslateModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  constructor(
    public errorService: ErrorService,
    private primengConfig: PrimeNGConfig
  ) {
    console.log('Production: ' + environment.prod)
  }
  ngOnInit() {
    this.setCalendarTranslation()
    this.setFullScreen()
  }
  title = 'appointment-app-frontend';
  elem = document.documentElement

  // This function translate all the calendars in the application
  setCalendarTranslation() {
    this.primengConfig.setTranslation({
      dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
      monthNames: [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ],
      monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      today: 'Oggi',
      clear: 'Cancella',
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1
    });
  }

  setFullScreen() {
    if(this.elem.requestFullscreen) {
      this.elem.requestFullscreen()
    }
  }
}
