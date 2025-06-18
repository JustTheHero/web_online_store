import React, { useState, useEffect } from 'react';
import './products.css';
import ProductCard from './productCard';
import ApiService from '../data/api.js';

const Products = () => {
  // Estado para armazenar lista de produtos
  const [products, setProducts] = useState([]);

  // Busca produtos da API ao montar o componente
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
        {/* Grid de produtos usando ProductCard para cada item */}
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