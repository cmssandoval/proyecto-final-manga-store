import blackCloverImage from '../assets/img/Bclover32.jpg';
import dorohedoroImage from '../assets/img/dorohedoro12.jpg';
import nagatoroImage from '../assets/img/Nagatoro3.jpg';
import kaseImage from '../assets/img/Kase4.jpg';

const featuredProducts = [
  {
    id: 1,
    series: 'Shonen',
    title: 'Black Clover',
    volume: 'Vol. 12',
    price: '$14.90',
    short: 'BC',
    tag: 'Top',
    colors: ['#f9d7e4', '#cfeeff'],
    image: blackCloverImage,
  },
  {
    id: 2,
    series: 'Shonen',
    title: 'Dorohedoro',
    volume: 'Vol. 7',
    price: '$12.50',
    short: 'AH',
    tag: 'New',
    colors: ['#f7dff8', '#d8f4ff'],
    image: dorohedoroImage,
  },
  {
    id: 3,
    series: 'Comedia',
    title: 'Nagatoro-san',
    volume: 'Vol. 16',
    price: '$16.20',
    short: 'JK',
    tag: 'Hot',
    colors: ['#f9d7d5', '#d9ebff'],
    image: nagatoroImage,
  },
  {
    id: 4,
    series: 'Yuri',
    title: 'Kase-San & Yamada',
    volume: 'Vol. 4',
    price: '$15.00',
    short: 'DS',
    tag: 'Gift',
    colors: ['#f9dfe9', '#dceeff'],
    image: kaseImage,
  },
];

export default featuredProducts;