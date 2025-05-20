import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import Welcome from './components/welcome.jsx';
import Products from './components/product.jsx';
import Footer from './components/footer.jsx';
import Cart from './components/cart.jsx';
import ProductDescription from './components/productDescription.jsx';
import Payment from './components/payment.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Welcome />
                <Products />
              </>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDescription />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;