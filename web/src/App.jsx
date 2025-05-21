import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import Welcome from './components/welcome.jsx';
import Products from './components/product.jsx';
import Footer from './components/footer.jsx';
import Cart from './components/cart.jsx';
import ProductDescription from './components/productDescription.jsx';
import Payment from './components/payment.jsx';
import Confirmation from './components/confirmation.jsx';
import UserAccount from './components/userAccount.jsx';
import LoginSection from './components/loginSection.jsx';
import Register from './components/register.jsx';

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
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/userAccount" element={<UserAccount />} />
            <Route path="/loginSection" element={<LoginSection />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;