import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    //FAZER LOGICA DE BUSCA
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
              <li><a href="#elojob">EloJob</a></li>
              <li><a href="#acounts">Accounts</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#coach">Coach</a></li>
            </ul>
          </div>
        </div>
        <div className="top_menu">
          <div className="icons_navigation">
            <Link to="/cart">Cart</Link>
            <a href="#account">Account</a>
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