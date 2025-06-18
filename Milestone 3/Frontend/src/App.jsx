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
import UserManagement from './components/userManagement.jsx';
import Storage from './components/storage.jsx';
import Coach from './components/coachs.jsx';
import EloBoost from './components/eloboost.jsx';
import Accounts from './components/accounts.jsx';
import Reviews from './components/reviews.jsx';
import SearchResults from './components/SearchResults.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import SalesManagement from './components/salesManagement.jsx';
//set de rotas para o react router
function App() {
  return (
    <CartProvider>
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
            <Route path="/coach" element={<Coach />} />
            <Route path="/eloboost" element={<EloBoost />} />
            <Route path="/Accounts" element={<Accounts />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/userAccount" element={<UserAccount />} />
            <Route path="/loginSection" element={<LoginSection />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userManagement" element={<UserManagement />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/salesManagement" element={<SalesManagement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;