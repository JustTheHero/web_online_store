import React, { useState } from 'react';
import productsData from '../data/products.js';
import './eloboost.css';
import ProductCard from './productCard';

const EloBoost = () => {
  // Filtrar apenas produtos de categoria "eloboost"
  const [eloboostProducts] = useState(
    productsData.filter(product => product.category === 'eloboost')
  );

  return (
    <section className="eloboost">
      <div className="container_eloboost">
        <div className="header_eloboost">
          <h2>EloBoost Services</h2>
          <p className="subtitle_eloboost">
            Reach the rank of your dreams with our professional boosting services.
          </p>
        </div>

        <div className="grid_eloboost">
          {eloboostProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EloBoost;