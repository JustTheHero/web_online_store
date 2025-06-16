import React, { useState, useEffect } from 'react';
import './accounts.css';
import ProductCard from './productCard';

const Accounts = () => {
  const [accountProducts, setAccountProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccountProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error(` Erro ${response.status}: ${response.statusText}`);
      }
      const products = await response.json();
      if (!Array.isArray(products)) {
        throw new Error('Formato de resposta inválido');
      }
      const accountProducts = products.filter(product => {
        const category = product.category?.toLowerCase();
        return category === 'account';
      });
      setAccountProducts(accountProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountProducts();
  }, []);
  if (loading) {
    return (
      <section className="accounts">
        <div className="container_accounts">
          <div className="loading_accounts">
            <div className="loading_spinner"></div>
            <p>Loading accounts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="accounts">
        <div className="container_accounts">  
          <div className="error_accounts">
            <h3>Error loading accounts</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="accounts">
      <div className="container_accounts">
        <div className="header_accounts">
          <h2>Smurf Accounts</h2>
          <p className="subtitle_accounts">
            High-quality smurf accounts for all skill levels.
          </p>

        </div>

        <div className="grid_accounts">
          {accountProducts.length > 0 ? (
            accountProducts.map(product => (
              <div key={product.id || product._id} className="account_card_wrapper">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="no_products">
              <p>No accounts available now</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Accounts;