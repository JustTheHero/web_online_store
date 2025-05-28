import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './productCard';
import './products.css'; 

const SearchResults = () => {
  const location = useLocation();
  const { products = [], query = '' } = location.state || {};

  return (
    <section className="products">
      <div className="container_products">
        <h2>
          {query ? `Resultados para "${query}"` : 'Resultados da Busca'}
        </h2>
        
        {products.length > 0 ? (
          <div className="grid_products">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>Nenhum produto encontrado para "{query}"</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;