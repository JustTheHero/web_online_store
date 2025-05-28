import React, { useState } from 'react';
import productsData from '../data/products.js';
import './products.css';
import ProductCard from './productCard';

const Products = () => {
  const [products] = useState(productsData);
  
  return (
    <section className="products">
      <div className="container_products">
        <h2>Products</h2>
        <div className="grid_products">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;