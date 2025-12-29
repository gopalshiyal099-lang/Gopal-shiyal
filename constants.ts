
import { Property } from './types';

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Sky Villa',
    price: '₹2.45 Cr',
    location: 'Bunder Road, Mahuva',
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    category: 'Sale',
    description: 'A luxurious sky villa with premium finishes and city views.',
    likes: 124,
    views: 1540
  },
  {
    id: '2',
    title: 'Emerald Garden Estate',
    price: '₹1.89 Cr',
    location: 'Station Road, Mahuva',
    beds: 5,
    baths: 4,
    sqft: 4500,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    category: 'Sale',
    description: 'Spacious estate featuring a private garden and ample parking.',
    likes: 89,
    views: 920
  },
  {
    id: '3',
    title: 'Azure Heights Apartment',
    price: '₹25,000 / mo',
    location: 'Near Nutan School, Mahuva',
    beds: 2,
    baths: 2,
    sqft: 1400,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    category: 'Rent',
    description: 'Modern apartment with all essential amenities and 24/7 security.',
    likes: 45,
    views: 650
  },
  {
    id: '4',
    title: 'Mahuva Business Hub',
    price: '₹5.50 Cr',
    location: 'Main Bazar, Mahuva',
    beds: 0,
    baths: 4,
    sqft: 5000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    category: 'Commercial',
    description: 'Prime commercial space ideal for retail or office headquarters.',
    likes: 210,
    views: 2800
  }
];

export const CONTACT_CONFIG = {
  phone: '+919999999999',
  whatsapp: '919999999999',
  email: 'info@mahuvaproperty.com',
  companyName: 'Mahuva Property'
};
