import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Home: React.FC = () => (
  <main className="max-w-7xl mx-auto px-4">
    <section className="py-32 text-center">
      <p className="text-accent font-semibold tracking-widest text-sm mb-4 uppercase">
        Born on the Circuit
      </p>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
        Race-Grade<br />Streetwear
      </h1>
      <p className="text-gray-500 max-w-xl mx-auto mb-10 text-lg">
        Formula 1 inspired clothing engineered for the streets. Every stitch, a lap time.
      </p>
      <Link to="/catalog">
        <Button size="lg">Shop the Collection</Button>
      </Link>
    </section>
  </main>
);

export default Home;
