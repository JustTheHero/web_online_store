import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import './header.css';

const Header = () => {
  // Estados para controle da busca
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  // Atualiza valor do campo de busca
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Processa envio da busca
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    console.log(searchQuery);
    
    // Redireciona para home se busca vazia
    if (searchQuery.trim() === '') {
      navigate('/');
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Busca produtos na API
      const response = await fetch('http://localhost:5000/api/products'); 
      
      if (!response.ok) {
        throw new Error('Error try again.');
      }
      
      const allProducts = await response.json();
      
      // Filtra produtos por título, descrição ou categoria
      const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      console.log(filteredProducts);
      
      // Navega para página de resultados com dados
      navigate('/search', { 
        state: { 
          products: filteredProducts, 
          query: searchQuery.trim() 
        } 
      });
      
    } catch (error) {
      console.error(error);
      // Navega para página de resultados com erro
      navigate('/search', { 
        state: { 
          products: [], 
          query: searchQuery.trim(),
          error: 'Error try again.' 
        } 
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <header className="header">
      <div className="container_header">
        {/* Logo e navegação principal */}
        <div className="logo-nav-group">
          <div className="logo">
            <Link to="/">EloJob<span>Die</span></Link>
          </div>
          <div className="container_nav">
            <ul className="nav_itens">
              <li><Link to="/eloboost">EloJob</Link></li>
              <li><Link to="/Accounts">Accounts</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/coach">Coach</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Menu superior com ícones e busca */}
        <div className="top_menu">
          {/* Ícones de navegação */}
          <div className="icons_navigation">
            <Link to="/cart" className="icon-link">
              <ShoppingCart size={20} />
              <span>Cart</span>
            </Link>
            <Link to="/loginSection" className="icon-link">
              <User size={20} />
              <span>Account</span>
            </Link>
          </div>
          
          {/* Barra de busca */}
          <div className="search_bar">
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text"
                placeholder={isSearching ? "Searching..." : "Search Products and services"}
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={isSearching}
              />
              {isSearching && <span className="search-loading">🔍</span>}
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;