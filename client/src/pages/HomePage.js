import React from 'react';
import { FeaturedProducts, FeaturedAvatars, Hero, Services, Contact } from '../components';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <FeaturedAvatars />
      <Services />
      <Contact />
    </main>
  );
}

export default HomePage
