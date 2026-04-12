import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Menu({ addToCart, user }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFood, setNewFood] = useState({ name: '', price: '' });

  const FOOD_API = import.meta.env.VITE_FOOD_API_URL || 'http://192.168.137.122:8082/foods';

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', price: '' });

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
      alert("Lỗi khi thêm món ăn mới.");
    }
  }

  const handleDeleteFood = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món này?")) return;
    try {
      await axios.delete(`${FOOD_API}/${id}`);
      fetchMenu();
    } catch(err) {
      alert("Lỗi khi xóa món ăn.");
    }
  }

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({ name: item.name, price: item.price });
  };

  const handleSaveEdit = async (id) => {
    if (!editFormData.name || !editFormData.price) return;
    try {
       await axios.put(`${FOOD_API}/${id}`, { name: editFormData.name, price: Number(editFormData.price) });
       setEditingId(null);
       fetchMenu();
    } catch(err) {
       alert("Lỗi khi cập nhật món ăn.");
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null);
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
          <h3 className="text-3xl font-light tracking-tight text-slate-900">Thực Đơn.</h3>
          <p className="text-slate-400 text-sm mt-3 uppercase tracking-widest font-medium">Lựa chọn tinh hoa ẩm thực</p>
        </div>
      </div>

      {user && user.role === 'ADMIN' && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-8 rounded-2xl mb-12 shadow-sm">
          <h4 className="text-sm uppercase tracking-widest font-bold text-slate-700 mb-6 flex items-center gap-3">
             <div className="p-1.5 bg-slate-200 rounded-md">
               <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             </div>
             Bảng Điều Khiển Admin - Thêm Món Mới
          </h4>
          <form onSubmit={handleAddFood} className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
            <input 
              required placeholder="Tên món ăn (vd: Phở Bò Chín...)" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})}
              className="flex-1 w-full px-5 py-3 rounded-lg bg-transparent text-sm font-medium focus:outline-none transition-colors"
            />
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <input 
              required type="number" placeholder="Giá tiền (VNĐ)" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})}
              className="w-full sm:w-1/3 px-5 py-3 rounded-lg bg-transparent text-sm font-medium focus:outline-none transition-colors"
            />
            <button type="submit" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white hover-lift text-sm uppercase tracking-widest font-bold py-3 px-8 rounded-lg transition-all shadow-md">
              Tạo Món Mới
            </button>
          </form>
        </div>
      )}

      {menu.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-lg text-slate-400 font-light">Danh sách thực đơn đang trống.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {menu.map((item, idx) => (
            <div key={item.id || idx} className="group relative flex flex-col justify-between bg-white rounded-2xl p-3 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              
              <div className="mb-4">
                <div className="h-52 bg-slate-50 rounded-xl flex items-center justify-center mb-5 overflow-hidden relative shadow-sm">
                  <img 
                    src={premiumImages[idx % premiumImages.length]} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {user && user.role === 'ADMIN' && editingId !== item.id && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => handleEditClick(item)} className="bg-white/95 border border-slate-200 hover:bg-slate-800 hover:text-white text-slate-600 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteFood(item.id)} className="bg-white/95 border border-rose-100 hover:bg-rose-500 hover:text-white text-rose-500 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {editingId === item.id ? (
                   <div className="animate-in fade-in zoom-in-95 duration-200 p-2 bg-slate-50 rounded-lg border border-slate-200">
                     <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Tên món</label>
                     <input 
                       value={editFormData.name} 
                       onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                       className="w-full mb-2 px-3 py-2 text-sm border-b border-slate-300 focus:border-slate-800 bg-transparent outline-none"
                     />
                     <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold ml-1">Giá (VNĐ)</label>
                     <input 
                       type="number"
                       value={editFormData.price} 
                       onChange={e => setEditFormData({...editFormData, price: e.target.value})} 
                       className="w-full mb-3 px-3 py-2 text-sm border-b border-slate-300 focus:border-slate-800 bg-transparent outline-none"
                     />
                     <div className="flex gap-2">
                        <button onClick={() => handleSaveEdit(item.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-md transition-colors">Lưu</button>
                        <button onClick={handleCancelEdit} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 rounded-md transition-colors">Hủy</button>
                     </div>
                   </div>
                ) : (
                   <div className="px-2">
                     <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{item.name}</h4>
                     <div className="text-sm font-semibold tracking-wide text-amber-600">
                       {item.price.toLocaleString('vi-VN')} VNĐ
                     </div>
                   </div>
                )}
              </div>
              
              {(!user || user.role !== 'ADMIN') && (
                <button 
                  onClick={() => addToCart(item)} 
                  className="w-full border-t border-slate-100 py-4 mt-2 text-xs uppercase tracking-widest font-bold transition-all text-slate-600 bg-slate-50/50 hover:bg-slate-900 hover:text-white rounded-b-xl"
                >
                  Thêm Vào Giỏ
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
