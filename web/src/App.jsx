import React from 'react';
import Header from './components/header.jsx';
import Welcome from './components/welcome.jsx';
import Products from './components/product.jsx';
import Footer from './components/footer.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Welcome />
        <Products />
      </main>
      <Footer />
    </div>
  );
}

export default App;

//o