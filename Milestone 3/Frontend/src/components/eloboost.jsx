import React, { useState, useEffect } from 'react';
import './eloboost.css';
import ProductCard from './productCard';

const EloBoost = () => {
  // Estados para gerenciar produtos, carregamento e erros
  const [accountProducts, setAccountProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar produtos da API
  const fetchAccountProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Requisição para API local
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const products = await response.json();
      
      if (!Array.isArray(products)) {
        throw new Error('Formato de resposta inválido');
      }
      
      // Filtra apenas produtos da categoria 'eloboost'
      const accountProducts = products.filter(product => {
        const category = product.category?.toLowerCase();
        return category === 'eloboost';
      });
      
      setAccountProducts(accountProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Executa a busca quando o componente é montado
  useEffect(() => {
    fetchAccountProducts();
  }, []);

  // Renderiza tela de carregamento
  if (loading) {
    return (
      <section className="eloboost">
        <div className="container_eloboost">
          <div className="loading_eloboost">
            <div className="loading_spinner"></div>
            <p>Loading boosts...</p>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza tela de erro
  if (error) {
    return (
      <section className="eloboost">
        <div className="container_eloboost">
          <div className="error_eloboost">
            <h3>Error loading products</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza lista de produtos
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
          {accountProducts.length > 0 ? (
            // Mapeia produtos em cards
            accountProducts.map(product => (
              <div key={product.id || product._id} className="eloboost_card_wrapper">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            // Mensagem quando não há produtos
            <div className="no_products">
              <p>No boost available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EloBoost;