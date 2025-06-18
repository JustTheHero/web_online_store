import React from 'react';
import './welcome.css';
import { useNavigate } from 'react-router-dom';
//paginá para estética da home page
const Welcome = () => {
    const navigate = useNavigate();
  
  return (
    <section className="welcome">
      <div className="container_welcome">
        <h1>Welcome to EloJobDie</h1>
        <p>Your one-stop shop for all your in-game problems. Quality products and reliable services to boost your gaming experience.</p>
        <a href="#promos" className="btn" onClick={() => navigate('/coach')}>See the promos</a>
      </div>
    </section>
  );
};

export default Welcome;


