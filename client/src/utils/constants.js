import React from 'react'
import { GiBeamsAura, GiGooeyDaemon, GiStabbedNote } from 'react-icons/gi'
export const links = [
  {
    id: 1,
    text: 'home',
    url: '/',
  },
  {
    id: 2,
    text: 'about',
    url: '/about',
  },
  {
    id: 3,
    text: 'cards',
    url: '/products',
  },
]

export const services = [
  {
    id: 1,
    icon: <GiBeamsAura />,
    title: 'Design',
    text:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum velit autem unde numquam nisi',
  },
  {
    id: 2,
    icon: <GiStabbedNote />,
    title: 'Story',
    text:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum velit autem unde numquam nisi',
  },
  {
    id: 3,
    icon: <GiGooeyDaemon />,
    title: 'Effect',
    text:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, ea. Perferendis corrupti reiciendis nesciunt rerum velit autem unde numquam nisi',
  },
]

//export const products_url = 'https://course-api.com/react-store-products'
export const products_url = 'http://localhost:5000/api/v1/cards?limit=300';

//export const single_product_url = `https://course-api.com/react-store-single-product?id=`
export const single_product_url = 'http://localhost:5000/api/v1/cards/';

//export const products_url = 'https://course-api.com/react-store-products'
export const avatars_url = 'http://localhost:5000/api/v1/avatars?limit=100';

//export const single_product_url = `https://course-api.com/react-store-single-product?id=`
export const single_avatar_url = 'http://localhost:5000/api/v1/avatars/';