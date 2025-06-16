import React, { useState, useEffect } from 'react';
import './products.css';
import ProductCard from './productCard';
import ApiService from '../data/api.js';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ApiService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);


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