import React, { useState } from 'react';
import axios from 'axios';

function Cart({ cart, user, clearCart }) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  const ORDER_API = import.meta.env.VITE_ORDER_API_URL || 'http://192.168.137.122:8083/orders';

  const handleCheckout = async () => {
    if (!user) {
      alert("Please authenticate prior to checkout.");
      return;
    }
    if (cart.length === 0) return;

    setIsOrdering(true);
    setPaymentError(null);
    setSuccessMsg(null);

    try {
      // ✅ Gửi 1 request duy nhất với tất cả items
      const orderItems = cart.map(item => ({
        foodItem: item.name,
        quantity: 1,
        price: Number(item.price),
        subtotal: Number(item.price)
      }));

      await axios.post(ORDER_API, {
        customerName: user.username,
        items: orderItems,
        paymentMethod: paymentMethod
      });

      setSuccessMsg(`Procurement successful via ${paymentMethod}.`);
      clearCart();
    } catch (err) {
      console.error(err);
      if(err.response && err.response.data) {
        setPaymentError(err.response.data); 
      } else {
        setPaymentError('Network disruption occurred.');
      }
    } finally {
      setIsOrdering(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10 text-center sm:text-left border-b border-slate-100 pb-8 flex justify-between items-end">
        <div>
           <h3 className="text-3xl font-light tracking-tight text-slate-900">Checkout.</h3>
           <p className="text-slate-400 text-sm mt-3 uppercase tracking-widest font-medium">Review and confirm.</p>
        </div>
      </div>
      
      {paymentError && (
        <div className="mb-8 p-5 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p>{paymentError}</p>
        </div>
      )}

      {successMsg && (
        <div className="mb-8 p-5 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <p>{successMsg}</p>
        </div>
      )}

      {cart.length === 0 && !successMsg ? (
        <div className="text-center py-24">
          <svg className="w-12 h-12 mx-auto text-slate-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-400">Cart is empty</p>
        </div>
      ) : cart.length > 0 && (
        <div>
          <div className="space-y-2 mb-10">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-5 border-b border-slate-100">
                <h4 className="text-base font-medium text-slate-800">{item.name}</h4>
                <div className="text-sm tracking-wide font-medium text-slate-500">
                  {item.price.toLocaleString('vi-VN')} VND
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-10 py-6">
             <h4 className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-5">Settlement Framework</h4>
             <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                   <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 focus:ring-1 transition-colors" />
                   <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                   <input type="radio" name="payment" value="Banking" checked={paymentMethod === 'Banking'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 focus:ring-1 transition-colors" />
                   <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Bank Transfer</span>
                </label>
             </div>
          </div>

          <div className="flex justify-between items-center py-6 mb-8 text-slate-900 bg-slate-50 px-6 rounded-lg">
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-500">Total Valuation</span>
            <span className="text-lg tracking-wide font-medium">{total.toLocaleString('vi-VN')} VND</span>
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={isOrdering}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm uppercase tracking-widest font-medium py-5 rounded-lg transition-colors active:bg-black disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isOrdering ? 'Processing...' : `Confirm Transaction`}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
