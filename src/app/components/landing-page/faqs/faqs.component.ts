import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  standalone: true,
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
  imports: [AccordionModule]
})
export class FaqsComponent {
  bookamiEmail: string = 'bookami.app@gmail.com'
}
