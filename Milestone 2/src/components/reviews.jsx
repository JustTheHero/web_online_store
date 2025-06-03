import React, { useState } from 'react';
import { Star, Trophy, Shield, User } from 'lucide-react';
import './Reviews.css';
import reviewsData from '../data/reviews.js';

const Reviews = () => {
  const [filter, setFilter] = useState('all');

  const filteredReviews = reviewsData.filter(review => 
    filter === 'all' || review.service.toLowerCase().includes(filter.toLowerCase())
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star ${index < rating ? 'star-filled' : 'star-empty'}`}
      />
    ));
  };

  const getServiceIcon = (service) => {
    if (service.includes('eloboost')) return <Trophy className="service-icon" />;
    if (service.includes('coach')) return <Shield className="service-icon" />;
    if (service.includes('account')) return <User className="service-icon" />;
    return <Star className="service-icon" />;
  };

  const getServiceLabel = (service) => {
  switch (service.toLowerCase()) {
    case 'eloboost':
      return 'Elo Boost';
    case 'coach':
      return 'Coaching';
    case 'account':
      return 'Smurf Account';
    default:
      return service;
  }
};

  return (
    <div className="reviews-container">
      <div className="reviews-wrapper">

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {['all', 'eloboost', 'coach', 'account'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`filter-btn ${filter === filterOption ? 'filter-btn-active' : ''}`}
            >
              {filterOption === 'all' ? 'All Reviews' : filterOption}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {filteredReviews.map((review) => (
            <div key={review.id} className="review-card">
              {/* Header */}
              <div className="review-header">
                <div className="customer-avatar">
                  {review.name.charAt(0)}
                </div>
                <div className="customer-info">
                  <h3 className="customer-name">{review.name}</h3>
                  <div className="service-info">
                    <span className="service-badge">
                      {getServiceIcon(review.service)}
                      {getServiceLabel(review.service)}
                    </span>
                    <span className="rank-badge">
                      {review.game}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="review-rating">
                <div className="stars-container">
                  {renderStars(review.rating)}
                </div>
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>

              {/* Comment */}
              <p className="review-comment">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;