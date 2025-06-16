import React, { useState, useEffect } from 'react';
import './coach.css';
import ProductCard from './productCard';

const Coach = () => {
  const [coachProducts, setCoachProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoachProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const products = await response.json();
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid response format');
      }      
      const coachProducts = products.filter(product => {
        const category = product.category?.toLowerCase();
        return category === 'coach';
      });
      
      setCoachProducts(coachProducts);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachProducts();
  }, []);
  if (loading) {
    return (
      <section className="coach">
        <div className="container_coach">
          <div className="loading_coach">
            <div className="loading_spinner"></div>
            <p>Loading coaches...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="coach">
        <div className="container_coach">  
          <div className="error_coach">
            <h3>Error loading products</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="coach">
      <div className="container_coach">
        <div className="header_coach">
          <h2>Coaching Services</h2>
          <p className="subtitle_coach">
            High-quality coaching services for all skill levels.
          </p>

        </div>

        <div className="grid_coach">
          {coachProducts.length > 0 ? (
            coachProducts.map(product => (
              <div key={product.id || product._id} className="coach_card_wrapper">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="no_products_coach">
              <p>No coaches available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Coach;