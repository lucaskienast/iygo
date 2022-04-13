import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Sidebar, Footer } from './components';
import {
  About,
  AuthWrapper,
  Cart,
  Error,
  Home,
  Products,
  SingleProduct
} from './pages';

function App() {
  return (
    <AuthWrapper>
      <Router>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/products' element={<Products />}/>
          <Route path='/products/:id' element={<SingleProduct />}/>
          <Route path='*' element={<Error />}/>
        </Routes>
        <Footer />
      </Router>
    </AuthWrapper>
  );
}

export default App
