import { Component } from '@angular/core';
import { Carousel, CarouselModule } from 'primeng/carousel';

interface Review {
  text: string
  avatar: string
  username: string
  shopType: string
}

@Component({
  standalone: true,
  imports: [CarouselModule],
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  constructor() {
    // This line make vertical scroll available on mobile while touching the carousel
    Carousel.prototype.onTouchMove = () => { };
  }

  reviews: Review[] = [
    {
      text: "Finalmente un'app intuitiva per gestire i miei clienti! Grazie a Bookami non ho più tempi morti e riesco a organizzarmi meglio. E la mia pagina online è tutta rosaaa! <3",
      avatar: "app/assets/images/avatar/avatar2.jpg",
      username: "Valentina U.",
      shopType: "Onicotecnica"
    },
    {
      text: "Avere un profilo pubblico personalizzato che i miei clienti associano direttamente a me, e non a una generica piattaforma per centri benessere, è davvero un altro livello.",
      avatar: "app/assets/images/avatar/avatar4.jpg",
      username: "Clara M.",
      shopType: "Salone"
    },
    {
      text: "Con Bookami ho aumentato i clienti e ridotto le cancellazioni. Il sistema di notifiche è incredibile. Super consigliato!",
      avatar: "app/assets/images/avatar/avatar3.jpg",
      username: "Luca F.",
      shopType: "Barber Shop"
    },
    {
      text: "Un'app incredibilmente utile! Posso gestire tutto dal mio telefono, ovunque io sia. Perfetta per chi vuole risparmiare tempo.",
      avatar: "app/assets/images/avatar/avatar1.jpg",
      username: "Emma G.",
      shopType: "Spa e Benessere"
    },
    {
      text: "Da quando uso Bookami, il mio studio funziona in modo più fluido. Non posso più farne a meno!",
      avatar: "app/assets/images/avatar/avatar5.jpg",
      username: "Marco L.",
      shopType: "Studio Fotografico"
    }
  ]

  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
