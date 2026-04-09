import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Menu({ addToCart, user }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFood, setNewFood] = useState({ name: '', price: '' });

  const FOOD_API = import.meta.env.VITE_FOOD_API_URL || 'http://192.168.137.122:8082/foods';

  const fetchMenu = () => {
    axios.get(FOOD_API)
      .then(res => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMenu();
  }, [FOOD_API]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await axios.post(FOOD_API, { name: newFood.name, price: Number(newFood.price) });
      setNewFood({ name: '', price: '' });
      fetchMenu();
    } catch(err) {
      alert("Failed to add component.");
    }
  }

  const handleDeleteFood = async (id) => {
    try {
      await axios.delete(`${FOOD_API}/${id}`);
      fetchMenu();
    } catch(err) {
      alert("Failed to delete component.");
    }
  }

  const handleEditFood = async (id, oldName, oldPrice) => {
    const newName = prompt("Modify item name:", oldName);
    const newPrice = prompt("Modify item price:", oldPrice);
    if (!newName || !newPrice) return;
    try {
       await axios.put(`${FOOD_API}/${id}`, { name: newName, price: Number(newPrice) });
       fetchMenu();
    } catch(err) {
       alert("Failed to update component.");
    }
  }

  const premiumImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=500&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80",
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12 border-b border-slate-100 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end">
        <div>
          <h3 className="text-3xl font-light tracking-tight text-slate-900">Signatures.</h3>
          <p className="text-slate-400 text-sm mt-3 uppercase tracking-widest font-medium">Curated culinary selections</p>
        </div>
      </div>

      {user && user.role === 'ADMIN' && (
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl mb-12">
          <h4 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-6 flex items-center gap-3">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             Administrator Panel
          </h4>
          <form onSubmit={handleAddFood} className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
              required placeholder="Item Name" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})}
              className="flex-1 w-full px-5 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-slate-800 focus:ring-0 outline-none transition-colors"
            />
            <input 
              required type="number" placeholder="Price (VND)" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})}
              className="w-full sm:w-1/3 px-5 py-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-slate-800 focus:ring-0 outline-none transition-colors"
            />
            <button type="submit" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-sm uppercase tracking-widest font-semibold py-3 px-8 rounded-lg transition-colors">Append</button>
          </form>
        </div>
      )}

      {menu.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-slate-400 font-light">The registry is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {menu.map((item, idx) => (
            <div key={item.id || idx} className="group relative flex flex-col justify-between">
              
              <div className="mb-6">
                <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center mb-6 overflow-hidden relative shadow-sm">
                  <img 
                    src={premiumImages[idx % premiumImages.length]} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {user && user.role === 'ADMIN' && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditFood(item.id, item.name, item.price)} className="bg-white/90 border border-slate-200 hover:bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteFood(item.id)} className="bg-white/90 border border-slate-200 hover:bg-rose-50 text-rose-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-slate-900 mb-1 leading-tight">{item.name}</h4>
                <div className="text-sm font-semibold tracking-wide text-slate-500">
                  {item.price.toLocaleString('vi-VN')} VND
                </div>
              </div>
              
              {(!user || user.role !== 'ADMIN') && (
                <button 
                  onClick={() => addToCart(item)} 
                  className="w-full border py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all border-slate-200 text-slate-700 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.98]"
                >
                  Select
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;
