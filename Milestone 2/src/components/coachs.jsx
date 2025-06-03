import React, { useState, useEffect } from 'react';
import './coach.css';
import ProductCard from './productCard';
import productsData from '../data/products.js';

const Coach = () => {
  const [products] = useState(
  productsData.filter(product => product.category === 'coach')
  );

  return (
    <section className="coach">
      <div className="container_coach">
        <h2>Coaching Services</h2>
        <div className="grid_coach">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="no-products">No coaching services available at the moment.</div>
        )}
      </div>
    </section>
  );
};

export default Coach;