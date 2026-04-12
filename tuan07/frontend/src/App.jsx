import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Menu from './Menu';
import Cart from './Cart';
import Admin from './Admin';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart([...cart, item]);
  const clearCart = () => setCart([]);

  return (
    <Router>
      <div className="max-w-6xl mx-auto min-h-screen pt-8 pb-12">
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 sm:p-12 border border-slate-100">
          <nav className="flex flex-col sm:flex-row justify-between items-center pb-8 mb-10 border-b border-slate-100 gap-6">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 uppercase">
                Gourmet
              </h2>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-6">
              <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest px-3">Menu</Link>
              
              {user && user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest px-3">
                  Admin
                </Link>
              )}
              
              {(!user || user.role !== 'ADMIN') && (
                <Link to="/cart" className="relative text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest px-3 flex items-center gap-2">
                  Cart
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                </Link>
              )}
              
              <div className="w-px h-4 bg-slate-200 mx-2"></div>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700 tracking-wide">{user.username}</span>
                  <button 
                    onClick={() => setUser(null)} 
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors uppercase tracking-widest">
                  Sign In
                </Link>
              )}
            </div>
          </nav>

          <main className="min-h-[60vh]">
            <Routes>
              <Route path="/" element={<Menu addToCart={addToCart} user={user} />} />
              <Route path="/cart" element={<Cart cart={cart} user={user} clearCart={clearCart} />} />
              <Route path="/admin" element={<Admin user={user} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
