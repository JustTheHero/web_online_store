import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productsData from '../data/products.js';
import './header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(searchQuery);
    if(searchQuery === ''){
      navigate('/');
      return;
    }
    const filteredProducts = productsData.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(filteredProducts);

    navigate('/search', { state: { products: filteredProducts, query: searchQuery } });
  };
  
  return (
    <header className="header">
      <div className="container_header">
        <div className="logo-nav-group">
          <div className="logo">
            <Link to="/">EloJob<span>Die</span></Link>
          </div>
          <div className="container_nav">
            <ul className="nav_itens">
              <li><Link to="/">EloJob</Link></li>
              <li><Link to="/Accounts">Accounts</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/coach">Coach</Link></li>
            </ul>
          </div>
        </div>
        <div className="top_menu">
          <div className="icons_navigation">
            <Link to="/cart">Cart</Link>
            <Link to="/loginSection">Account</Link>
          </div>
          <div className="search_bar">
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text"
                placeholder="Search Products and services"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;