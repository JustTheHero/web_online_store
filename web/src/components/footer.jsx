import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container_footer">
        <div className="content_footer">
          <div className="col_footer">
            <h3>EloJobDie</h3>
            <ul>
              <li><a href="#elojob">EloJob</a></li>
              <li><a href="#acounts">Accounts</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#coach">Coach</a></li>
            </ul>
          </div>
          <div className="col_footer">
            <h3>Customer Services</h3>
            <ul>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
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
        <div className="bottom_footer">
          <p>&copy; {new Date().getFullYear()} EloJobDie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
