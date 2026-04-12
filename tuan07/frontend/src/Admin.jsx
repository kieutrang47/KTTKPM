import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ORDER_API = import.meta.env.VITE_ORDER_API_URL || 'http://192.168.137.122:8083/orders';

  useEffect(() => {
    fetchOrders();
    // Auto refresh mỗi 10 giây
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(ORDER_API);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  // Tính toán thống kê
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === 'PAID').length;
  const orderedOrders = orders.filter(o => o.status === 'ORDERED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        <p className="mt-4 text-slate-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left border-b border-slate-100 pb-8">
        <h3 className="text-3xl font-light tracking-tight text-slate-900">Admin Dashboard.</h3>
        <p className="text-slate-400 text-sm mt-3 uppercase tracking-widest font-medium">
          Quản lý đơn hàng - {user?.username}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Tổng Đơn Hàng
          </div>
          <div className="text-4xl font-bold text-blue-900">{totalOrders}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Đã Thanh Toán
          </div>
          <div className="text-4xl font-bold text-green-900">{paidOrders}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
          <div className="text-yellow-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Đang Xử Lý
          </div>
          <div className="text-4xl font-bold text-yellow-900">{orderedOrders}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="text-purple-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Doanh Thu
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
        </div>
      </div>

      {/* Auto Refresh Info */}
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Tự động làm mới mỗi 10 giây</span>
      </div>

      {/* Orders Table */}
      {error && (
        <div className="mb-8 p-5 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <svg className="w-16 h-16 mx-auto text-slate-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
            Chưa có đơn hàng nào
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  ID
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Khách Hàng
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Món Ăn
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Tổng Tiền
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Thanh Toán
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900">#{order.id}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{order.customerName}</td>
                  <td className="py-4 px-4">
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-slate-700 font-medium">{item.foodItem}</span>
                            <span className="text-slate-400 ml-2">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-sm">(Đơn hàng cũ)</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {order.totalPrice ? (
                      <span className="font-semibold text-green-600">
                        {order.totalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      {order.paymentMethod || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'ORDERED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
