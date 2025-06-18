import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './productCard';
import './products.css';

const SearchResults = () => {
  // Obtém dados passados via navegação (state)
  const location = useLocation();
  const { products = [], query = '', error = null } = location.state || {};

  return (
    <section className="products">
      <div className="container_products">
        {/* Título dinâmico baseado na query de busca */}
        <h2>
          {query ? `Results for "${query}"` : 'Search Results'}
        </h2>
        
        {/* Exibe mensagem de erro se houver */}
        {error && (
          <div className="error-message">
            <p style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
              {error}
            </p>
          </div>
        )}
        
        {/* Renderiza produtos encontrados ou mensagem de "não encontrado" */}
        {!error && products.length > 0 ? (
          <div className="grid_products">
            {products.map(product => (
              <ProductCard 
                key={product.id || product._id} 
                product={product} 
              />
            ))}
          </div>
        ) : !error && (
          <div className="no-results">
            <h3>No matches found for "{query}"</h3>
            <p>Try searching with different keywords or browse our categories.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;