import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container_footer">
        <div className="content_footer">
          {/* Seção principal com links de navegação */}
          <div className="col_footer">
            <h3>EloJobDie</h3>
            <ul>
              <li><Link to="/eloboost">EloJob</Link></li>
              <li><Link to="/Accounts">Accounts</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/coach">Coach</Link></li>
            </ul>
          </div>
          
          {/* Seção de atendimento ao cliente */}
          <div className="col_footer">
            <h3>Customer Services</h3>
            <ul>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          
          {/* Seção de redes sociais */}
          <div className="col_footer">
            <h3>Connect with Us</h3>
            <ul>
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#youtube">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        {/* Rodapé com copyright dinâmico */}
        <div className="bottom_footer">
          <p>&copy; {new Date().getFullYear()} EloJobDie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;