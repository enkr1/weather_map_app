export interface Station {
  name: string;
  lat: number;
  lng: number;
}

export const stations: Station[] = [
  { name: 'Ang Mo Kio', lat: 1.37008, lng: 103.84952 },
  { name: 'Jurong East', lat: 1.33311, lng: 103.74229 },
  { name: 'Hougang', lat: 1.37000, lng: 103.88700 },
  { name: 'Tampines', lat: 1.35390, lng: 103.94500 },
  { name: 'Clementi', lat: 1.31570, lng: 103.76540 },
  { name: 'Toa Payoh', lat: 1.33250, lng: 103.84960 },
  { name: 'Geylang', lat: 1.31540, lng: 103.88500 },
  { name: 'Kallang', lat: 1.31000, lng: 103.86300 },
  { name: 'Choa Chu Kang', lat: 1.38450, lng: 103.74400 },
  { name: 'Tanjong Pagar', lat: 1.27900, lng: 103.84400 }
];
