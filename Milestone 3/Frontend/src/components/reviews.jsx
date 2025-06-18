import React, { useState, useEffect } from 'react';
import { Star, Trophy, Shield, User, Loader } from 'lucide-react';

const Reviews = () => {
  // Estados do componente
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Busca reviews da API quando componente monta
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:5000/api/reviews');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setReviews(data.reviews || []);
        
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filtra reviews baseado no filtro selecionado
  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    
    const productName = review.productName?.toLowerCase() || '';
    return productName.includes(filter.toLowerCase());
  });

  // Renderiza estrelas baseado na avaliação
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star ${index < rating ? 'star-filled' : 'star-empty'}`}
      />
    ));
  };

  // Retorna ícone baseado no tipo de serviço
  const getServiceIcon = (productName) => {
    const product = productName?.toLowerCase() || '';
    if (product.includes('boost') || product.includes('elo')) return <Trophy className="service-icon" />;
    if (product.includes('coach') || product.includes('training')) return <Shield className="service-icon" />;
    if (product.includes('account') || product.includes('smurf')) return <User className="service-icon" />;
    return <Star className="service-icon" />;
  };

  // Retorna label do serviço baseado no nome do produto
  const getServiceLabel = (productName) => {
    const product = productName?.toLowerCase() || '';
    if (product.includes('boost') || product.includes('elo')) return 'Elo Boost';
    if (product.includes('coach') || product.includes('training')) return 'Coaching';
    if (product.includes('account') || product.includes('smurf')) return 'Smurf Account';
    return productName || 'Service';
  };

  // Categoriza produto por jogo (função não usada no render atual)
  const getProductCategory = (productName) => {
    const product = productName?.toLowerCase() || '';
    if (product.includes('lol') || product.includes('league')) return 'League of Legends';
    if (product.includes('valorant')) return 'Valorant';
    if (product.includes('csgo') || product.includes('cs2')) return 'CS2';
    if (product.includes('tft')) return 'TFT';
    return 'Gaming';
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="reviews-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          color: '#8b949e'
        }}>
          <Loader style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} />
          Loading reviews...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          color: '#ff6b6b',
          textAlign: 'center'
        }}>
          <div>
            <h3>Error loading reviews</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS inline para estilização completa */}
      <style>{`
        .reviews-container {
          background-color: #0d1117;
          color: #e6e6e6;
          font-family: 'Exo 2', 'Roboto', 'Open Sans', sans-serif;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .reviews-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .reviews-header {
          text-align: center;
          margin-bottom: 50px;
          background: linear-gradient(135deg, #161b22 0%, #21262d 100%);
          padding: 40px;
          border-radius: 15px;
          border: 2px solid #00BFFF;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 191, 255, 0.3);
        }

        .reviews-title {
          font-size: 3rem;
          font-family: 'Orbitron', sans-serif;
          color: #00BFFF;
          text-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
          margin-bottom: 15px;
          font-weight: bold;
        }

        .rating-summary {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .stars-container {
          display: flex;
          gap: 3px;
        }

        .star {
          width: 1rem;
          height: 1rem;
        }

        .star-filled {
          color: #00BFFF;
          fill: #00BFFF;
        }

        .star-empty {
          color: #6b7280;
        }

        .average-rating {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00BFFF;
        }

        .review-count {
          color: #8b949e;
          font-size: 1.1rem;
        }

        .reviews-subtitle {
          font-size: 1.2rem;
          color: #8b949e;
          max-width: 600px;
          margin: 0 auto;
        }

        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 12px 25px;
          background-color: transparent;
          color: #e6e6e6;
          border: 2px solid #00BFFF;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          text-transform: capitalize;
          transition: all 0.3s ease;
          font-size: 1rem;
          box-shadow: none;
        }

        .filter-btn:hover {
          background-color: rgba(0, 191, 255, 0.1);
          color: #00BFFF;
        }

        .filter-btn-active {
          background-color: #00BFFF !important;
          color: #0d1117 !important;
          box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
        }

        .filter-btn-active:hover {
          background-color: #00BFFF !important;
          color: #0d1117 !important;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .review-card {
          background-color: #161b22;
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #30363d;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .review-card:hover {
          border-color: #00BFFF;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 191, 255, 0.3);
          transform: translateY(-5px);
        }

        .review-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          gap: 15px;
        }

        .customer-avatar {
          width: 50px;
          height: 50px;
          background-color: #00BFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d1117;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .customer-info {
          flex: 1;
        }

        .customer-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: #e6e6e6;
          margin-bottom: 5px;
        }

        .service-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .service-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #21262d;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #00BFFF;
        }

        .service-icon {
          width: 1rem;
          height: 1rem;
        }

        .rank-badge {
          background-color: #30363d;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #8b949e;
        }

        .review-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .review-date {
          color: #8b949e;
          font-size: 0.9rem;
        }

        .review-comment {
          line-height: 1.6;
          color: #e6e6e6;
          font-size: 1rem;
          font-style: italic;
          margin: 0;
        }

        @media (max-width: 768px) {
          .reviews-container {
            padding: 20px 10px;
          }
          
          .reviews-header {
            padding: 30px 20px;
          }
          
          .reviews-title {
            font-size: 2.5rem;
          }
          
          .filter-buttons {
            gap: 10px;
          }
          
          .filter-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
          .review-card {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .reviews-title {
            font-size: 2rem;
          }
          
          .rating-summary {
            flex-direction: column;
            gap: 5px;
          }
          
          .customer-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
          
          .customer-name {
            font-size: 1.1rem;
          }
          
          .review-comment {
            font-size: 0.95rem;
          }
        }
      `}</style>
      
      <div className="reviews-container">
        <div className="reviews-wrapper">
          {/* Botões de filtro por categoria */}
          <div className="filter-buttons">
            {['all', 'boost', 'coach', 'account'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`filter-btn ${filter === filterOption ? 'filter-btn-active' : ''}`}
              >
                {filterOption === 'all' ? 'All Reviews' : filterOption}
              </button>
            ))}
          </div>

          {/* Grid de reviews */}
          <div className="reviews-grid">
            {filteredReviews.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#8b949e'
              }}>
                {filter === 'all' ? 'No reviews found.' : `No reviews found for "${filter}".`}
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="review-card">
                  {/* Header do card com avatar e info do usuário */}
                  <div className="review-header">
                    <div className="customer-avatar">
                      {(review.userId?.email?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <div className="customer-info">
                      <h3 className="customer-name">
                        {review.userId?.email?.split('@')[0] || 'User'}
                      </h3>
                      <div className="service-info">
                        <span className="service-badge">
                          {getServiceIcon(review.productName)}
                          {getServiceLabel(review.productName)}
                        </span>
                        <span className="rank-badge">
                         {review.productName|| 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating com estrelas e data */}
                  <div className="review-rating">
                    <div className="stars-container">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">
                      {new Date(review.timestamp || review.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Comentário da review */}
                  {review.comment && (
                    <p className="review-comment">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reviews;