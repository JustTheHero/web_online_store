import React from 'react';
import './welcome.css';

const Welcome = () => {
  return (
    <section className="welcome">
      <div className="container_welcome">
        <h1>Welcome to EloJobDie</h1>
        <p>Your one-stop shop for all your in-game problems. Quality products and reliable services to boost your gaming experience.</p>
        <a href="#promos" className="btn">See the promos</a>
      </div>
    </section>
  );
};

export default Welcome;


