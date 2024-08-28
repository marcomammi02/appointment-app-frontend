import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StoreStaff {
  staffList: Staff[] =  [
    {
      id: '1',
      name: 'Valentina',
      lastname: 'Uzzo',
      role: 'Onicotecnica',
      image: 'https://example.com/images/laura-bianchi.jpg'
    },
    {
      id: '2',
      name: 'Marco',
      lastname: 'Rossi',
      role: 'Massaggiatore',
      image: 'https://example.com/images/marco-rossi.jpg'
    },
    {
      id: '3',
      name: 'Sara',
      lastname: 'Verdi',
      role: 'Receptionist',
      image: 'https://example.com/images/sara-verdi.jpg'
    },
    {
      id: '4',
      name: 'Francesca',
      lastname: 'Neri',
      role: 'Nail Artist',
      image: 'https://example.com/images/francesca-neri.jpg'
    },
    {
      id: '5',
      name: 'Davide',
      lastname: 'Galli',
      role: 'Parrucchiere',
      image: 'https://example.com/images/davide-galli.jpg'
    }
  ];
}


export interface Staff {
  id: string
  name: string
  lastname: string
  role: string
  image: string
}
