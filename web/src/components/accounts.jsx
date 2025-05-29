import React, { useState } from 'react';
import productsData from '../data/products.js';
import './accounts.css';
import ProductCard from './productCard';

const Accounts = () => {
  // Filtrar apenas produtos de categoria "account"
  const [accountProducts] = useState(
    productsData.filter(product => product.category === 'account')
  );

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
          {accountProducts.map(product => (
            <div key={product.id} className="account_card_wrapper">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accounts;