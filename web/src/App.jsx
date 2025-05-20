import React from 'react';
import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';
import Products from './components/Products/Products';
import Footer from './components/Footer/Footer';

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